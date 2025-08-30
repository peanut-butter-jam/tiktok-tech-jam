import asyncio
from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, SystemMessage

from app.dtos.system_prompt_dto import AgentType
from app.services.system_prompt.system_prompt_service import (
    SystemPromptServiceDep,
    system_prompt_service_context,
)
from app.database.schemas import EvalResult
from app.database.schemas.enums.status import Status
from app.database.repositories.check_repository import CheckRepositoryDep, check_repository_context
from app.database.repositories.eval_result_repository import (
    EvalResultRepositoryDep,
    eval_result_repository_context,
)
from app.dtos.eval_result_dto import EvalResultDTO
from app.services.feature.feat_eval.query_rous_tool import QueryRousTool
from app.dtos.check_dto import CheckDTO, CheckUpdateDTO
from app.dtos.feature_dto import FeatureDTO
from app.services.regulation.regulation_service import RegulationServiceDep, regulation_service_context
from app.config.app_config import OpenAIConfigDep, get_app_config

user_prompt_template = PromptTemplate.from_template(
    """
Evaluate the following feature for geo-specific compliance needs.

Feature Title:
{feature_title}

Feature Description:
{feature_desc}

Terminologies Mapping:
{mapping}
"""
)


class FeatEvalAgent:
    def __init__(
        self,
        openai_config: OpenAIConfigDep,
        regulation_service: RegulationServiceDep,
        check_repository: CheckRepositoryDep,
        eval_result_repository: EvalResultRepositoryDep,
        system_prompt_service: SystemPromptServiceDep,
    ):
        model = ChatOpenAI(model="gpt-4o-mini", api_key=openai_config.api_key)
        self.agent = create_react_agent(
            model=model,
            response_format=EvalResultDTO,
            tools=[QueryRousTool(regulation_service=regulation_service)],
        )
        self.check_repository = check_repository
        self.eval_result_repository = eval_result_repository
        self.system_prompt_service = system_prompt_service
        # Lock to prevent concurrent access
        self.check_repository_lock = asyncio.Lock()
        self.eval_result_repository_lock = asyncio.Lock()

    async def ainvoke(self, feature: FeatureDTO, check: CheckDTO) -> CheckDTO:
        # try:
        system_prompt = await self.system_prompt_service.get_active_prompt_text(
            AgentType.FEATURE_EVAL_AGENT
        )
        result = await self._eval_feature(feature, system_prompt)
        await self._update_check_with_result(check.id, result)
        # except Exception:
        #     async with self.check_repository_lock:
        #         await self.check_repository.update_by_id(check.id, CheckUpdateDTO(status=Status.FAILED))

        return check

    async def _eval_feature(self, feature: FeatureDTO, system_prompt: str) -> EvalResultDTO:
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(
                content=user_prompt_template.format_prompt(
                    feature_title=feature.title,
                    feature_desc=feature.description,
                    mapping=feature.terminologies or "None",
                ).to_string()
            ),
        ]
        res = await self.agent.ainvoke({"messages": messages})

        return EvalResultDTO.model_validate(res["structured_response"])

    async def _update_check_with_result(self, check_id: int, eval_result: EvalResultDTO) -> None:
        async with self.eval_result_repository_lock:
            await self.eval_result_repository.create(
                EvalResult(check_id=check_id, **eval_result.model_dump())
            )

        async with self.check_repository_lock:
            await self.check_repository.update_by_id(check_id, CheckUpdateDTO(status=Status.COMPLETED))


FeatEvalAgentDep = Annotated[FeatEvalAgent, Depends(FeatEvalAgent)]


@asynccontextmanager
async def feat_eval_agent_context():
    """
    Context manager for FeatEvalAgent.
    """
    openai_config = get_app_config().openai
    async with (
        regulation_service_context() as regulation_service,
        check_repository_context() as check_repo,
        eval_result_repository_context() as eval_result_repo,
        system_prompt_service_context() as system_prompt_service,
    ):
        yield FeatEvalAgent(
            openai_config=openai_config,
            regulation_service=regulation_service,
            check_repository=check_repo,
            eval_result_repository=eval_result_repo,
            system_prompt_service=system_prompt_service,
        )
