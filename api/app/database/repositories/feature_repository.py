from app.database.repositories.session import AsyncDbSessionDep
from app.database.schemas.feature import Feature
from api.app.database.repositories.base_repository import BaseRepository
from typing import Annotated
from fastapi import Depends


class FeatureRepository(BaseRepository[Feature]):

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(Feature, session)


FeatureRepositoryDep = Annotated[FeatureRepository, Depends(FeatureRepository)]
