from typing import Annotated, Dict

from fastapi import Depends
from sqlalchemy.orm import selectinload

from app.config.app_config import FeatEvalConfigDep
from app.dtos.system_prompt_dto import (
    ActivePromptDTO,
    SystemPromptVersionCreateDTO,
    SystemPromptVersionDTO,
)
from app.database.repositories.active_prompt_repository import ActivePromptRepositoryDep
from app.database.schemas.active_prompt import ActivePrompt
from app.database.schemas.enums.agent_type import AgentType
from app.database.repositories.system_prompt_version_repository import (
    SystemPromptVersionRepositoryDep,
)


def get_default_prompts(feat_eval_config: FeatEvalConfigDep):
    return {
        AgentType.FEATURE_EVAL_AGENT: feat_eval_config.system_prompt,
    }


class SystemPromptService:
    def __init__(
        self,
        system_prompt_version_repository: SystemPromptVersionRepositoryDep,
        active_prompt_repository: ActivePromptRepositoryDep,
        default_prompts: Dict[AgentType, str] = Depends(get_default_prompts),
    ) -> None:
        self.system_prompt_version_repository = system_prompt_version_repository
        self.active_prompt_repository = active_prompt_repository
        self.default_prompts = default_prompts

    async def get_active_prompt(self, agent_type: AgentType) -> SystemPromptVersionDTO | None:
        active_prompt = await self.active_prompt_repository.get_by_filter(
            options=[selectinload(ActivePrompt.active_prompt)], agent_type=agent_type
        )

        if not active_prompt:
            return None

        active = ActivePromptDTO.model_validate(active_prompt[0])
        return active.active_prompt

    async def get_active_prompt_text(self, agent_type: AgentType) -> str:
        active_prompt = await self.get_active_prompt(agent_type)
        if not active_prompt:
            print(f"Using default prompt for agent type: {agent_type}")
            return self.default_prompts[agent_type]

        print(f"Using prompt with version {active_prompt.id} for agent type: {agent_type}")
        return active_prompt.system_prompt

    async def patch_prompt(self, new_version: SystemPromptVersionCreateDTO) -> None:
        agent_type = new_version.agent_type
        active_prompt = await self.get_active_prompt(agent_type)

        # Create new version
        version_to_create = new_version.model_copy()
        version_to_create.parent_version = active_prompt.id if active_prompt else None
        inserted_version = await self.system_prompt_version_repository.create(version_to_create.to_db())

        # Apply version
        if active_prompt:
            await self.active_prompt_repository.delete_by_filter(agent_type=agent_type)

        await self.active_prompt_repository.create(
            ActivePrompt(agent_type=agent_type, active_prompt=inserted_version)
        )


SystemPromptServiceDep = Annotated[SystemPromptService, Depends(SystemPromptService)]
