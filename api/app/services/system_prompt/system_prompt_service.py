from contextlib import asynccontextmanager
from typing import Annotated, Dict
from fastapi import Depends
from sqlalchemy.orm import selectinload

from app.config.app_config import FeatEvalConfigDep, get_app_config
from app.dtos.system_prompt_dto import (
    ActivePromptDTO,
    SystemPromptVersionCreateDTO,
    SystemPromptVersionDTO,
)
from app.database.repositories.active_prompt_repository import (
    ActivePromptRepositoryDep,
    active_prompt_repository_context,
)
from app.database.schemas.active_prompt import ActivePrompt
from app.database.schemas.enums.agent_type import AgentType
from app.database.repositories.system_prompt_version_repository import (
    SystemPromptVersionRepositoryDep,
    system_prompt_version_repository_context,
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
            return self.default_prompts[agent_type]

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


@asynccontextmanager
async def system_prompt_service_context():
    """
    Context manager for SystemPrompt.
    """
    feat_eval_config = get_app_config().feat_eval

    async with (
        system_prompt_version_repository_context() as system_prompt_version_repository,
        active_prompt_repository_context() as active_prompt_repository,
    ):
        yield SystemPromptService(
            system_prompt_version_repository=system_prompt_version_repository,
            active_prompt_repository=active_prompt_repository,
            default_prompts=get_default_prompts(feat_eval_config),
        )
