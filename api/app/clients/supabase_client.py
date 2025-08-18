from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends
from supabase import create_async_client, AsyncClient

from app.config.app_config import SupabaseConfigDep, get_app_config


async def get_supabase_client_cached(url: str, key: str) -> AsyncClient:
    return await create_async_client(
        supabase_url=url,
        supabase_key=key,
    )


async def get_supabase_client(config: SupabaseConfigDep) -> AsyncClient:
    return await get_supabase_client_cached(
        url=config.url,
        key=config.service_role_key.get_secret_value(),
    )


AsyncSupabaseClientDep = Annotated[AsyncClient, Depends(get_supabase_client)]


@asynccontextmanager
async def supabase_client_context():
    supabase_config = get_app_config().supabase

    yield await get_supabase_client_cached(
        url=supabase_config.url,
        key=supabase_config.service_role_key.get_secret_value(),
    )
