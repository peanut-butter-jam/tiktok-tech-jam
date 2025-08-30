from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends

from app.database.schemas.check import Check
from app.database.repositories.session import AsyncDbSessionDep, async_db_session_context
from app.database.repositories.base_repository import BaseRepository


class CheckRepository(BaseRepository[Check]):
    """Repository for managing checks."""

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(Check, session)


CheckRepositoryDep = Annotated[CheckRepository, Depends(CheckRepository)]


@asynccontextmanager
async def check_repository_context():
    """
    Context manager for CheckRepository.
    """
    async with async_db_session_context() as session:
        yield CheckRepository(session)
