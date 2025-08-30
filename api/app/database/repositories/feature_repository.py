from contextlib import asynccontextmanager
from app.database.repositories.session import AsyncDbSessionDep, async_db_session_context
from app.database.schemas.feature import Feature
from app.database.repositories.base_repository import BaseRepository
from typing import Annotated
from fastapi import Depends


class FeatureRepository(BaseRepository[Feature]):

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(Feature, session)


FeatureRepositoryDep = Annotated[FeatureRepository, Depends(FeatureRepository)]


@asynccontextmanager
async def feature_repository_context():
    """
    Context manager for FeatureRepository.
    """
    async with async_db_session_context() as session:
        yield FeatureRepository(session)
