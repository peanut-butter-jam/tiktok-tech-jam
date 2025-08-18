from contextlib import contextmanager
from functools import lru_cache
from typing import Annotated
from fastapi import Depends
from openai import AsyncOpenAI

from app.config.app_config import OpenAIConfigDep, get_app_config


@lru_cache
def get_async_openai_client_cached(api_key: str) -> AsyncOpenAI:
    return AsyncOpenAI(api_key=api_key)


def get_async_openai_client(config: OpenAIConfigDep):
    return get_async_openai_client_cached(api_key=config.api_key.get_secret_value())


AsyncOpenAIClientDep = Annotated[AsyncOpenAI, Depends(get_async_openai_client)]


@contextmanager
def async_openai_client_context():
    openai_config = get_app_config().openai
    yield get_async_openai_client_cached(api_key=openai_config.api_key.get_secret_value())
