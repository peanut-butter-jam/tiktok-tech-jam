from typing import Annotated
from fastapi import Depends

from app.database.schemas.eval_result import EvalResult
from app.database.schemas.check import Check
from app.database.repositories.session import AsyncDbSessionDep
from app.database.repositories.base_repository import BaseRepository


class EvalResultRepository(BaseRepository[EvalResult]):
    """Repository for managing evaluation results."""

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(EvalResult, session)


EvalResultRepositoryDep = Annotated[EvalResultRepository, Depends(EvalResultRepository)]
