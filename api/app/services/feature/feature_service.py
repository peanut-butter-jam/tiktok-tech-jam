from typing import Annotated, List
from fastapi import Depends
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError

from app.database.schemas.check import Check
from app.dtos.feature_dto import FeatureCreateDTO, FeatureUpdateDTO, FeatureDTOWithCheck
from app.database.schemas.feature import Feature
from app.database.schemas.terminology import Terminology
from app.database.repositories.feature_repository import FeatureRepositoryDep
from app.database.repositories.terminology_repository import TerminologyRepositoryDep


class FeatureService:

    def __init__(
        self, 
        feature_repository: FeatureRepositoryDep,
        terminology_repository: TerminologyRepositoryDep
    ):
        self.feature_repository = feature_repository
        self.terminology_repository = terminology_repository

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

    async def update_feature(self, feature_id: int, feature_update: FeatureUpdateDTO) -> FeatureDTOWithCheck:
        # First check if the feature exists
        existing_feature = await self.feature_repository.get_one_by_id(feature_id)
        if not existing_feature:
            raise ValueError("Feature not found")

        # Update the feature using the repository's update_by_id method (full replacement)
        await self.feature_repository.update_by_id(feature_id, feature_update)
        
        # Sync terminologies to terminology table if provided
        if feature_update.terminologies:
            await self._sync_terminologies_to_table(feature_update.terminologies)
        
        # Return the updated feature
        return await self.get_feature_by_id(feature_id)

    async def _sync_terminologies_to_table(self, terminologies: dict[str, str]) -> None:
        """Check if key-value pairs exist in terminology table, insert if not"""
        for key, value in terminologies.items():
            if not key or not value:  # Skip empty keys/values
                continue
            
            # Check if this exact key-value pair exists
            existing_pairs = await self.terminology_repository.get_by_filter(key=key, value=value)
            
            if not existing_pairs:
                # Insert new key-value pair
                try:
                    new_terminology = Terminology(key=key, value=value)
                    await self.terminology_repository.create(new_terminology)
                except IntegrityError:
                    # Handle potential race conditions - another request might have inserted it
                    pass


FeatureServiceDep = Annotated[FeatureService, Depends(FeatureService)]
