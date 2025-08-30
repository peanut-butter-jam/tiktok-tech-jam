from typing import Annotated, List
from uuid import UUID
from fastapi import Depends, UploadFile
from sqlalchemy.orm import selectinload
import pandas as pd
from sqlalchemy.orm.interfaces import ORMOption

from app.database.schemas.check import Check
from app.dtos.feature_dto import FeatureCreateDTO, FeatureDTOWithCheck
from app.database.schemas.feature import Feature
from app.database.repositories.feature_repository import FeatureRepositoryDep

LOAD_CHECKS_OPTIONS: list[ORMOption] = [selectinload(Feature.checks).selectinload(Check.eval_result)]


class FeatureService:

    def __init__(self, feature_repository: FeatureRepositoryDep):
        self.feature_repository = feature_repository

    async def get_all_features(self) -> List[FeatureDTOWithCheck]:
        entries = await self.feature_repository.get_all(options=LOAD_CHECKS_OPTIONS)

        return [FeatureDTOWithCheck.model_validate(entry) for entry in entries]

    async def get_feature_by_id(self, feature_id: int) -> FeatureDTOWithCheck:
        entry = await self.feature_repository.get_one_by_id(feature_id, options=LOAD_CHECKS_OPTIONS)

        if not entry:
            raise ValueError("Feature not found")

        return FeatureDTOWithCheck.model_validate(entry)

    async def get_many_features_by_ids(self, feature_ids: List[int | UUID]) -> List[FeatureDTOWithCheck]:
        entries = await self.feature_repository.get_many_by_ids(feature_ids, options=LOAD_CHECKS_OPTIONS)
        return [FeatureDTOWithCheck.model_validate(entry) for entry in entries]

    async def delete_feature_by_id(self, feature_id: int) -> None:
        await self.feature_repository.delete_by_id(feature_id)

    async def create_feature(self, feature: FeatureCreateDTO) -> FeatureDTOWithCheck:
        inserted = await self.feature_repository.create(feature.to_db())

        return await self.get_feature_by_id(inserted.id)

    async def update_feature(
        self, feature_id: int, feature_update: FeatureCreateDTO
    ) -> FeatureDTOWithCheck:
        # First check if the feature exists
        existing_feature = await self.feature_repository.get_one_by_id(feature_id)
        if not existing_feature:
            raise ValueError("Feature not found")

        # Update the feature using the repository's update_by_id method (full replacement)
        await self.feature_repository.update_by_id(feature_id, feature_update)

        # Return the updated feature
        return await self.get_feature_by_id(feature_id)

    async def import_features_from_csv(self, csv_file: UploadFile) -> List[FeatureDTOWithCheck]:
        if csv_file.content_type != "text/csv":
            raise ValueError("Invalid file type. Please upload a CSV file.")

        df = pd.read_csv(csv_file.file)
        features = [FeatureCreateDTO.model_validate(row) for row in df.to_dict(orient="records")]

        inserted_features = await self.feature_repository.create_many(
            [feature.to_db() for feature in features]
        )
        features_with_check = await self.feature_repository.get_many_by_ids(
            [feature.id for feature in inserted_features],
            options=LOAD_CHECKS_OPTIONS,
        )

        return [FeatureDTOWithCheck.model_validate(entry) for entry in features_with_check]


FeatureServiceDep = Annotated[FeatureService, Depends(FeatureService)]
