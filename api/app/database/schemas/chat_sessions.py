from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.schemas.mixins.serial_id_mixin import SerialIdMixin
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base
from schemas.chat_messages import ChatMessage
from typing import List


class ChatSession(Base, SerialIdMixin, TimestampMixin):
    __tablename__ = "chat_sessions"

    chat_messages: Mapped[List[ChatMessage]] = relationship(
        "chat_messages", back_populates="chat_session"
    )
