from typing import Annotated
from fastapi import Depends
from app.database.schemas.check_regulation import CheckRegulation
from app.database.repositories.session import AsyncDbSessionDep
from api.app.database.repositories.base_repository import BaseRepository


class CheckRegulationRepository(BaseRepository[CheckRegulation]):
    """Repository for managing check regulations."""

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(CheckRegulation, session)


CheckRegulationRepositoryDep = Annotated[
    CheckRegulationRepository, Depends(CheckRegulationRepository)
]
