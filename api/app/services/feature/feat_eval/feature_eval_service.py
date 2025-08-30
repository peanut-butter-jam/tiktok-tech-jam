import asyncio
from typing import Annotated, List
from fastapi import BackgroundTasks, Depends

from app.dtos.check_dto import CheckDTO
from app.dtos.feature_dto import FeatureDTO
from app.database.schemas.enums.check_type import CheckType
from app.services.check.check_service import CheckServiceDep
from app.services.feature.feature_service import FeatureServiceDep
from app.services.feature.feat_eval.feat_eval_agent import FeatEvalAgentDep
from app.services.feature.feat_eval.term_mapping_agent import term_mapping_agent_context

# Max 10 concurrent evaluations
semaphore = asyncio.Semaphore(15)


class FeatureEvalService:
    def __init__(
        self,
        feature_service: FeatureServiceDep,
        check_service: CheckServiceDep,
        feat_eval_agent: FeatEvalAgentDep,
        background_tasks: BackgroundTasks,
    ):
        self.feature_service = feature_service
        self.check_service = check_service
        self.feat_eval_agent = feat_eval_agent
        self.background_tasks = background_tasks

    async def _trigger_eval(self, feature: FeatureDTO, check: CheckDTO):
        async with semaphore:
            feature_to_eval = feature

            if not feature.terminologies:
                async with term_mapping_agent_context() as term_mapping_agent:
                    feature_to_eval = await term_mapping_agent.ainvoke(feature)

            await self.feat_eval_agent.ainvoke(feature_to_eval, check)

    async def trigger_evals(self, feature_ids: List[int]) -> List[CheckDTO]:
        checks = await self.check_service.init_checks(feature_ids, check_type=CheckType.AI)
        features = await self.feature_service.get_many_features_by_ids(feature_ids)

        async def run_concurrent_tasks(features: List[FeatureDTO], checks: List[CheckDTO]):
            await asyncio.gather(
                *[self._trigger_eval(feature, check) for feature, check in zip(features, checks)]
            )

        self.background_tasks.add_task(run_concurrent_tasks, features, checks)

        return checks


FeatureEvalServiceDep = Annotated[FeatureEvalService, Depends(FeatureEvalService)]
