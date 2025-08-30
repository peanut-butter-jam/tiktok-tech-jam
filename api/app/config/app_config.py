from functools import lru_cache
from typing import Annotated
from fastapi import Depends
from pydantic_settings import (
    BaseSettings,
    PydanticBaseSettingsSource,
    SettingsConfigDict,
    YamlConfigSettingsSource,
)

from app.config.models.learning_agent_config import LearningAgentConfig
from app.config.models.feat_eval_config import FeatEvalConfig
from app.config.models.openai_config import OpenAIConfig
from app.config.models.supabase_config import SupabaseConfig
from app.config.env_config import EnvConfig
from app.config.models.core_config import CoreConfig


class AppConfig(BaseSettings):
    core: CoreConfig
    supabase: SupabaseConfig
    openai: OpenAIConfig
    feat_eval: FeatEvalConfig
    learning_agent: LearningAgentConfig

    model_config = SettingsConfigDict(
        yaml_file=[f"config/{EnvConfig().env}.yaml"],  # type: ignore
        env_file=[".env"],
        env_nested_delimiter="__",
        extra="ignore",
    )

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        return (
            env_settings,
            dotenv_settings,
            YamlConfigSettingsSource(settings_cls),
        )


@lru_cache
def get_app_config() -> AppConfig:
    return AppConfig()  # type: ignore


CoreConfigDep = Annotated[CoreConfig, Depends(lambda config=Depends(get_app_config): config.core)]
SupabaseConfigDep = Annotated[
    SupabaseConfig, Depends(lambda config=Depends(get_app_config): config.supabase)
]
OpenAIConfigDep = Annotated[OpenAIConfig, Depends(lambda config=Depends(get_app_config): config.openai)]
FeatEvalConfigDep = Annotated[
    FeatEvalConfig, Depends(lambda config=Depends(get_app_config): config.feat_eval)
]
LearningAgentConfigDep = Annotated[
    LearningAgentConfig, Depends(lambda config=Depends(get_app_config): config.learning_agent)
]
