from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.schemas.mixins.serial_id_mixin import SerialIdMixin
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from app.database.schemas.chat_message import ChatMessage


class ChatSession(Base, SerialIdMixin, TimestampMixin):
    __tablename__ = "chat_sessions"

    chat_messages: Mapped[List["ChatMessage"]] = relationship(
        "ChatMessage", back_populates="chat_session"
    )
