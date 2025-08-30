import uuid
from pydantic import BaseModel, ConfigDict

from app.database.schemas.enums.agent_type import AgentType
from app.database.schemas.system_prompt_version import SystemPromptVersion


class SystemPromptVersionCreateDTO(BaseModel):
    agent_type: AgentType
    system_prompt: str
    patch_summary: str
    parent_version: uuid.UUID | None = None

    def to_db(self) -> SystemPromptVersion:
        return SystemPromptVersion(
            agent_type=self.agent_type,
            system_prompt=self.system_prompt,
            patch_summary=self.patch_summary,
            parent_version=self.parent_version,
        )


class SystemPromptVersionDTO(SystemPromptVersionCreateDTO):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID


class ActivePromptDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    agent_type: AgentType
    active_prompt: SystemPromptVersionDTO
