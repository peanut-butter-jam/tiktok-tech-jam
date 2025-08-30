from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends

from app.database.schemas.eval_result import EvalResult
from app.database.repositories.session import AsyncDbSessionDep, async_db_session_context
from app.database.repositories.base_repository import BaseRepository


class EvalResultRepository(BaseRepository[EvalResult]):
    """Repository for managing evaluation results."""

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(EvalResult, session)


EvalResultRepositoryDep = Annotated[EvalResultRepository, Depends(EvalResultRepository)]


@asynccontextmanager
async def eval_result_repository_context():
    """
    Context manager for EvalResultRepository.
    """
    async with async_db_session_context() as session:
        yield EvalResultRepository(session)
