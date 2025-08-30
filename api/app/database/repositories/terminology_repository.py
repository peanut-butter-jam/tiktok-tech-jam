from app.database.repositories.session import AsyncDbSessionDep
from app.database.schemas.terminology import Terminology
from app.database.repositories.base_repository import BaseRepository
from typing import Annotated
from fastapi import Depends


class TerminologyRepository(BaseRepository[Terminology]):

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(Terminology, session)


TerminologyRepositoryDep = Annotated[TerminologyRepository, Depends(TerminologyRepository)]