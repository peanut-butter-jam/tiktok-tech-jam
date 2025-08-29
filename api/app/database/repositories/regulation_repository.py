from typing import Annotated
from fastapi import Depends
from app.database.schemas.regulation import Regulation
from app.database.repositories.session import AsyncDbSessionDep
from app.database.repositories.base_repository import BaseRepository


class RegulationRepository(BaseRepository[Regulation]):
    """Repository for managing regulations."""

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(Regulation, session)


RegulationRepositoryDep = Annotated[RegulationRepository, Depends(RegulationRepository)]
