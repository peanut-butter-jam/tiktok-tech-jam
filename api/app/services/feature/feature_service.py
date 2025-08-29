from typing import List
from fastapi import Depends
from typing_extensions import Annotated

from app.database.schemas.feature import Feature
from app.database.repositories.check_repository import CheckRepositoryDep
from app.dtos.feature_dto import GetFeatureDTO, CreateFeatureDTO
from app.dtos.check_dto import CheckDTO
from app.database.repositories.rou_repository import RouRepositoryDep
from app.database.repositories.feature_repository import FeatureRepositoryDep


class FeatureService:

    def __init__(
        self,
        feature_repository: FeatureRepositoryDep,
        rou_repository: RouRepositoryDep,
        check_repository: CheckRepositoryDep,
    ) -> None:
        self.feature_repository = feature_repository
        self.rou_repository = rou_repository
        self.check_repository = check_repository

    async def get_all_features(self) -> List[GetFeatureDTO]:
        entries = await self.feature_repository.get_all()

        entries_dto = [
            GetFeatureDTO(
                id=entry.id,
                title=entry.title,
                description=None,
                created_at=entry.created_at,
                updated_at=entry.updated_at,
                checks=None,
            )
            for entry in entries
        ]

        return entries_dto

    async def get_feature_by_id(self, feature_id: int) -> GetFeatureDTO | None:
        entry = await self.feature_repository.get_one_by_id(feature_id)
        if not entry:
            return None

        entry_dto = GetFeatureDTO(
            id=entry.id,
            title=entry.title,
            description=entry.description,
            created_at=entry.created_at,
            updated_at=entry.updated_at,
            checks=([CheckDTO.model_validate(check) for check in entry.checks] if entry.checks else []),
        )

        return entry_dto

    async def create_feature(self, feature: CreateFeatureDTO):
        entry = await self.feature_repository.create(
            Feature(
                title=feature.title,
                description=feature.description,
            )
        )

    # NOTE : check initiaion not done yet


FeatureServiceDep = Annotated[FeatureService, Depends(FeatureService)]
