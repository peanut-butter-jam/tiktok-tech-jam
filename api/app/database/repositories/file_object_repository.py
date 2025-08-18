from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends
from app.database.repositories.session import AsyncDbSessionDep, async_db_session_context
from app.database.repositories.base_repository import BaseRepository
from app.database.schemas.file_object import FileObject


class FileObjectRepository(BaseRepository[FileObject]):
    """Repository for managing to FileObject."""

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(FileObject, session)


FileObjectRepositoryDep = Annotated[FileObjectRepository, Depends(FileObjectRepository)]


@asynccontextmanager
async def file_object_repository_context():
    """
    Context manager for FileObjectRepository.
    """
    async with async_db_session_context() as session:
        yield FileObjectRepository(session)
