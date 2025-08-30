from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends

from app.database.schemas.system_prompt_version import SystemPromptVersion
from app.database.repositories.session import AsyncDbSessionDep, async_db_session_context
from app.database.repositories.base_repository import BaseRepository


class SystemPromptVersionRepository(BaseRepository[SystemPromptVersion]):

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(SystemPromptVersion, session)


SystemPromptVersionRepositoryDep = Annotated[
    SystemPromptVersionRepository, Depends(SystemPromptVersionRepository)
]


@asynccontextmanager
async def system_prompt_version_repository_context():
    """
    Context manager for SystemPromptVersionRepository.
    """
    async with async_db_session_context() as session:
        yield SystemPromptVersionRepository(session)
