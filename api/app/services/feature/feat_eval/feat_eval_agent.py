from typing import Annotated, List
from fastapi import BackgroundTasks, Depends
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from sqlalchemy.orm import selectinload

from app.dtos.system_prompt_dto import AgentType
from app.services.system_prompt.system_prompt_service import SystemPromptServiceDep
from app.database.schemas import Check, EvalResult
from app.database.schemas.enums.status import Status
from app.database.repositories.check_repository import CheckRepositoryDep
from app.database.repositories.eval_result_repository import EvalResultRepositoryDep
from app.dtos.eval_result_dto import EvalResultDTO
from app.services.feature.feat_eval.query_rous_tool import QueryRousTool
from app.dtos.check_dto import CheckCreateDTO, CheckDTO, CheckType, CheckUpdateDTO
from app.dtos.feature_dto import FeatureDTO
from app.services.regulation.regulation_service import RegulationServiceDep
from app.config.app_config import OpenAIConfigDep

user_prompt_template = PromptTemplate.from_template(
    """
Evaluate the following feature for geo-specific compliance needs.

Feature:
- feature_name: {feature_name}
- feature_description: {feature_desc}
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
        background_task: BackgroundTasks,
    ):
        model = ChatOpenAI(model="gpt-4o-mini", api_key=openai_config.api_key)
        self.agent = create_react_agent(
            model=model,
            response_format=EvalResultDTO,
            tools=[QueryRousTool(regulation_service=regulation_service)],
            debug=True,
        )
        self.check_repository = check_repository
        self.eval_result_repository = eval_result_repository
        self.system_prompt_service = system_prompt_service
        self.background_task = background_task

    async def invoke(self, feature: FeatureDTO) -> CheckDTO:
        check = (await self._init_checks([feature.id]))[0]

        self.background_task.add_task(self._run_bg_task, feature, check)

        return check

    async def invoke_multiple(self, features: List[FeatureDTO]) -> List[CheckDTO]:
        checks = await self._init_checks([feature.id for feature in features])

        for feature, check in zip(features, checks):
            self.background_task.add_task(self._run_bg_task, feature, check)

        return checks

    async def _run_bg_task(self, feature: FeatureDTO, check: CheckDTO) -> None:
        eval_result = await self._eval_feature(feature)
        await self._update_check_with_result(check.id, eval_result)

    async def _init_checks(self, feature_ids: List[int]) -> List[CheckDTO]:
        new_checks = [
            CheckCreateDTO(type=CheckType.AI, feature_id=feature_id) for feature_id in feature_ids
        ]

        inserted_checks = await self.check_repository.create_many(
            [check.to_db() for check in new_checks]
        )
        checks_with_result = await self.check_repository.get_many_by_ids(
            [check.id for check in inserted_checks], options=[selectinload(Check.eval_result)]
        )

        return [CheckDTO.model_validate(check) for check in checks_with_result]

    async def _eval_feature(self, feature: FeatureDTO) -> EvalResultDTO:
        system_prompt = await self.system_prompt_service.get_active_prompt_text(
            AgentType.FEATURE_EVAL_AGENT
        )
        messages = [
            system_prompt,
            HumanMessage(
                content=user_prompt_template.format_prompt(
                    feature_name=feature.title, feature_desc=feature.description
                ).to_string()
            ),
        ]
        res = await self.agent.ainvoke({"messages": messages})

        print(f"Evaluated feature: {feature.title}")

        return EvalResultDTO.model_validate(res["structured_response"])

    async def _update_check_with_result(self, check_id: int, eval_result: EvalResultDTO) -> None:
        await self.eval_result_repository.create(
            EvalResult(check_id=check_id, **eval_result.model_dump())
        )

        await self.check_repository.update_by_id(check_id, CheckUpdateDTO(status=Status.COMPLETED))


FeatEvalAgentDep = Annotated[FeatEvalAgent, Depends(FeatEvalAgent)]
