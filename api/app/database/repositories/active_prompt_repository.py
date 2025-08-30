from app.database.schemas.active_prompt import ActivePrompt
from app.database.repositories.session import AsyncDbSessionDep
from app.database.repositories.base_repository import BaseRepository
from typing import Annotated
from fastapi import Depends


class ActivePromptRepository(BaseRepository[ActivePrompt]):

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(ActivePrompt, session)


ActivePromptRepositoryDep = Annotated[ActivePromptRepository, Depends(ActivePromptRepository)]
