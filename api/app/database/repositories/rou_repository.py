from typing import Annotated

from fastapi import Depends
from app.database.schemas.rou import ROU
from app.database.repositories.session import AsyncDbSessionDep
from app.database.repositories.base_repository import BaseRepository


class RouRepository(BaseRepository[ROU]):
    """Repository for managing regulatory obligation units."""

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(ROU, session)


RouRepositoryDep = Annotated[RouRepository, Depends(RouRepository)]
