from typing import Annotated, List
from fastapi import Depends
from sqlalchemy.orm import selectinload

from app.database.schemas.check import Check
from app.dtos.feature_dto import FeatureCreateDTO, FeatureDTOWithCheck
from app.database.schemas.feature import Feature
from app.database.repositories.feature_repository import FeatureRepositoryDep


class FeatureService:

    def __init__(self, feature_repository: FeatureRepositoryDep):
        self.feature_repository = feature_repository

    async def get_all_features(self) -> List[FeatureDTOWithCheck]:
        entries = await self.feature_repository.get_all(
            options=[selectinload(Feature.checks).selectinload(Check.eval_result)]
        )

        return [FeatureDTOWithCheck.model_validate(entry) for entry in entries]

    async def get_feature_by_id(self, feature_id: int) -> FeatureDTOWithCheck:
        entry = await self.feature_repository.get_one_by_id(
            feature_id, options=[selectinload(Feature.checks).selectinload(Check.eval_result)]
        )

        if not entry:
            raise ValueError("Feature not found")

        return FeatureDTOWithCheck.model_validate(entry)

    async def create_feature(self, feature: FeatureCreateDTO) -> FeatureDTOWithCheck:
        inserted = await self.feature_repository.create(
            Feature(
                title=feature.title,
                description=feature.description,
            )
        )

        return await self.get_feature_by_id(inserted.id)

    async def update_feature(self, feature_id: int, feature_update: FeatureCreateDTO) -> FeatureDTOWithCheck:
        # First check if the feature exists
        existing_feature = await self.feature_repository.get_one_by_id(feature_id)
        if not existing_feature:
            raise ValueError("Feature not found")

        # Update the feature using the repository's update_by_id method (full replacement)
        await self.feature_repository.update_by_id(feature_id, feature_update)
        
        # Return the updated feature
        return await self.get_feature_by_id(feature_id)


FeatureServiceDep = Annotated[FeatureService, Depends(FeatureService)]
