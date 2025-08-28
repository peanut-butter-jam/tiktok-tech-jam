from sqlalchemy import Text, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.schemas.mixins.serial_id_mixin import SerialIdMixin
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base
from api.app.database.schemas.chat_session import ChatSession
from schemas.enums.role import Role


class ChatMessage(Base, SerialIdMixin, TimestampMixin):
    __tablename__ = "chat_messages"

    message: Mapped[str] = mapped_column(Text, nullable=False)
    role: Mapped[Role] = mapped_column(Enum(Role), nullable=False)

    chat_session_id: Mapped[int] = mapped_column(
        ForeignKey("chat_sessions.id"), nullable=False
    )

    chat_session: Mapped[ChatSession] = relationship(
        "chat_sessions", back_populates="chat_messages"
    )
