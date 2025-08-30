from typing import TYPE_CHECKING
import uuid
from sqlalchemy import UUID, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.schemas.enums.agent_type import AgentType
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base

if TYPE_CHECKING:
    from app.database.schemas.system_prompt_version import SystemPromptVersion


class ActivePrompt(Base, TimestampMixin):
    __tablename__ = "active_prompts"

    agent_type: Mapped[AgentType] = mapped_column(Enum(AgentType), primary_key=True)
    active_prompt_id: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("system_prompt_versions.id"), nullable=False
    )

    active_prompt: Mapped["SystemPromptVersion"] = relationship("SystemPromptVersion")
