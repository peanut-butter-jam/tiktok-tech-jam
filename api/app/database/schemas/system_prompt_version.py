import uuid
from sqlalchemy import UUID, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.schemas.enums.agent_type import AgentType
from app.database.schemas.mixins.uuid_mixin import UuidMixin
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base


class SystemPromptVersion(Base, UuidMixin, TimestampMixin):
    __tablename__ = "system_prompt_versions"

    agent_type: Mapped[AgentType] = mapped_column(Enum(AgentType), nullable=False)
    system_prompt: Mapped[str] = mapped_column(Text, nullable=False)
    patch_summary: Mapped[str] = mapped_column(Text, nullable=True)
    parent_version: Mapped[uuid.UUID] = mapped_column(UUID, nullable=True)
