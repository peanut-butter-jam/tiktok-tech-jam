from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends
from app.database.schemas.rou import ROU
from app.database.repositories.session import AsyncDbSessionDep, async_db_session_context
from app.database.repositories.base_repository import BaseRepository


class RouRepository(BaseRepository[ROU]):
    """Repository for managing regulatory obligation units."""

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(ROU, session)


RouRepositoryDep = Annotated[RouRepository, Depends(RouRepository)]


@asynccontextmanager
async def rou_repository_context():
    """
    Context manager for RouRepository.
    """
    async with async_db_session_context() as session:
        yield RouRepository(session)
