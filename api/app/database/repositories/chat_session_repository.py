from typing import Annotated
from fastapi import Depends
from app.database.schemas.chat_session import ChatSession
from app.database.repositories.session import AsyncDbSessionDep
from app.database.repositories.base_repository import BaseRepository


class ChatSessionRepository(BaseRepository[ChatSession]):
    """Repository for managing chat sessions."""

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(ChatSession, session)


ChatSessionRepositoryDep = Annotated[
    ChatSessionRepository, Depends(ChatSessionRepository)
]
