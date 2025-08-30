from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends

from app.database.schemas.active_prompt import ActivePrompt
from app.database.repositories.session import AsyncDbSessionDep, async_db_session_context
from app.database.repositories.base_repository import BaseRepository


class ActivePromptRepository(BaseRepository[ActivePrompt]):

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(ActivePrompt, session)


ActivePromptRepositoryDep = Annotated[ActivePromptRepository, Depends(ActivePromptRepository)]


@asynccontextmanager
async def active_prompt_repository_context():
    """
    Context manager for ActivePromptRepository.
    """
    async with async_db_session_context() as session:
        yield ActivePromptRepository(session)
