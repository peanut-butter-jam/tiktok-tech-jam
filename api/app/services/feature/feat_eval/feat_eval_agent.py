from typing import Annotated
from fastapi import BackgroundTasks, Depends
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from sqlalchemy.orm import selectinload

from app.database.schemas import Check, EvalResult
from app.database.schemas.enums.status import Status
from app.database.repositories.check_repository import CheckRepositoryDep
from app.database.repositories.eval_result_repository import EvalResultRepositoryDep
from app.dtos.eval_result_dto import EvalResultDTO
from app.services.feature.feat_eval.query_rous_tool import QueryRousTool
from app.dtos.check_dto import CheckCreateDTO, CheckDTO, CheckUpdateDTO
from app.dtos.feature_dto import FeatureDTO
from app.services.regulation.regulation_service import RegulationServiceDep
from app.config.app_config import FeatEvalConfigDep, OpenAIConfigDep

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
        feat_eval_config: FeatEvalConfigDep,
        regulation_service: RegulationServiceDep,
        check_repository: CheckRepositoryDep,
        eval_result_repository: EvalResultRepositoryDep,
        background_task: BackgroundTasks,
    ):
        model = ChatOpenAI(model="gpt-4o-mini", api_key=openai_config.api_key)
        self.agent = create_react_agent(
            model=model,
            response_format=EvalResultDTO,
            tools=[QueryRousTool(regulation_service=regulation_service)],
        )
        self.system_prompt = feat_eval_config.system_prompt
        self.check_repository = check_repository
        self.eval_result_repository = eval_result_repository
        self.background_task = background_task

    async def invoke(self, feature: FeatureDTO) -> CheckDTO:
        check = await self._init_check(feature.id)

        async def run_bg_task():
            eval_result = await self._eval_feature(feature)
            await self._update_check_with_result(check.id, eval_result)

        self.background_task.add_task(run_bg_task)

        return check

    async def _init_check(self, feature_id: int) -> CheckDTO:
        new_check = CheckCreateDTO(feature_id=feature_id)

        inserted_check = await self.check_repository.create(new_check.to_db())

        check_with_empty_result = await self.check_repository.get_one_by_id(
            inserted_check.id, options=[selectinload(Check.eval_result)]
        )

        if not check_with_empty_result:
            raise LookupError("Check not found")

        return CheckDTO.model_validate(check_with_empty_result)

    async def _eval_feature(self, feature: FeatureDTO) -> EvalResultDTO:
        messages = [
            self.system_prompt,
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
