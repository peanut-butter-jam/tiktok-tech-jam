from typing import Annotated
from fastapi import BackgroundTasks, Depends
from sqlalchemy.orm import selectinload

from app.dtos.system_prompt_dto import AgentType
from app.dtos.feature_dto import FeatureDTO
from app.services.feature.feature_service import FeatureServiceDep
from app.services.feature.feat_eval.learning_agent import LearningAgentDep
from app.database.schemas.enums.check_type import CheckType
from app.database.schemas.check import Check
from app.dtos.check_dto import CheckDTO, Status
from app.database.repositories.check_repository import CheckRepositoryDep
from app.database.repositories.eval_result_repository import EvalResultRepositoryDep
from app.dtos.eval_result_dto import HumanReconciledEvalResultDTO


class CheckService:
    def __init__(
        self,
        check_repository: CheckRepositoryDep,
        eval_result_repository: EvalResultRepositoryDep,
        feature_service: FeatureServiceDep,
        background_task: BackgroundTasks,
        learning_agent: LearningAgentDep,
    ):
        self.check_repository = check_repository
        self.eval_result_repository = eval_result_repository
        self.feature_service = feature_service
        self.background_task = background_task
        self.learning_agent = learning_agent

    async def get_check_by_id(self, check_id: int) -> CheckDTO:
        check = await self.check_repository.get_one_by_id(
            check_id, options=[selectinload(Check.eval_result)]
        )

        if not check:
            raise LookupError(f"Check with id {check_id} not found.")

        return CheckDTO.model_validate(check)

    async def reconcile_check_result(
        self, feature_id: int, reconciled_result: HumanReconciledEvalResultDTO
    ) -> CheckDTO:
        feature = await self.feature_service.get_feature_by_id(feature_id)
        prev_check = feature.latest_check

        check_to_insert = Check(
            type=CheckType.HUMAN,
            feature_id=feature_id,
            status=Status.COMPLETED,
            eval_result=reconciled_result.to_db(),
        )

        inserted_check = await self.check_repository.create(check_to_insert)
        new_check = await self.get_check_by_id(inserted_check.id)

        # Trigger learning if previous check was AI-based
        if prev_check and prev_check.type == CheckType.AI:
            await self.trigger_learning(feature, prev_check, new_check)

        return new_check

    async def trigger_learning(self, feature: FeatureDTO, prev_check: CheckDTO, new_check: CheckDTO):
        input = f"Feature name: {feature.title} Feature description: {feature.description}"

        if not prev_check.eval_result or not new_check.eval_result:
            raise ValueError("Both previous and new check results must be available for learning.")

        agent_output = f"{prev_check.eval_result.model_dump(mode="json")}"
        reconciled_output = f"{new_check.eval_result.model_dump(mode="json")}"

        self.background_task.add_task(
            self.learning_agent.ainvoke,
            agent_type=AgentType.FEATURE_EVAL_AGENT,
            input=input,
            agent_output=agent_output,
            reconciled_output=reconciled_output,
        )


CheckServiceDep = Annotated[CheckService, Depends(CheckService)]
