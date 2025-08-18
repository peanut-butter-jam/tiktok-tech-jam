from contextlib import asynccontextmanager
from typing import Annotated, AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config.app_config import CoreConfigDep, get_app_config


def get_async_sessionmaker(config: CoreConfigDep) -> async_sessionmaker:
    async_database_url = config.database_url.replace("postgresql://", "postgresql+asyncpg://")
    engine = create_async_engine(async_database_url)
    return async_sessionmaker(engine, expire_on_commit=False)


AsyncSessionMakeDep = Annotated[async_sessionmaker, Depends(get_async_sessionmaker)]


async def get_async_db_session(factory: AsyncSessionMakeDep) -> AsyncGenerator[AsyncSession, None]:
    async with factory() as session:
        yield session


AsyncDbSessionDep = Annotated[AsyncSession, Depends(get_async_db_session)]


@asynccontextmanager
async def async_db_session_context():
    factory = get_async_sessionmaker(get_app_config().core)
    async with factory() as session:
        yield session
