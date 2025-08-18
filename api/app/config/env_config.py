from functools import lru_cache
from typing import Annotated
from fastapi import Depends
from pydantic_settings import BaseSettings, PydanticBaseSettingsSource, SettingsConfigDict


class EnvConfig(BaseSettings):
    env: str

    model_config = SettingsConfigDict(env_file=[".env"], extra="ignore")

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        return (env_settings, dotenv_settings)


@lru_cache
def get_env_config() -> EnvConfig:
    return EnvConfig()  # type: ignore


EnvConfigDep = Annotated[EnvConfig, Depends(get_env_config)]
