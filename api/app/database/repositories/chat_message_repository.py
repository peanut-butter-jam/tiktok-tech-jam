from typing import Annotated
from fastapi import Depends
from app.database.schemas.chat_message import ChatMessage
from app.database.repositories.session import AsyncDbSessionDep
from api.app.database.repositories.base_repository import BaseRepository


class ChatMessageRepository(BaseRepository[ChatMessage]):
    """Repository for managing chat messages."""

    def __init__(self, session: AsyncDbSessionDep) -> None:
        super().__init__(ChatMessage, session)


ChatMessageRepositoryDep = Annotated[
    ChatMessageRepository, Depends(ChatMessageRepository)
]
