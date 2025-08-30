from app.database.schemas.system_prompt_version import SystemPromptVersion
from app.database.repositories.session import AsyncDbSessionDep
from app.database.repositories.base_repository import BaseRepository
from typing import Annotated
from fastapi import Depends


class SystemPromptVersionRepository(BaseRepository[SystemPromptVersion]):

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(SystemPromptVersion, session)


SystemPromptVersionRepositoryDep = Annotated[
    SystemPromptVersionRepository, Depends(SystemPromptVersionRepository)
]
