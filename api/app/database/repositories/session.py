import asyncio
from contextlib import asynccontextmanager
from typing import Annotated, AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config.app_config import CoreConfigDep, get_app_config


DATABASE_URL = get_app_config().core.database_url.replace("postgresql://", "postgresql+asyncpg://")

# create engine once
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,  # per-process persistent connections
    max_overflow=40,  # extra temporary connections allowed
    pool_timeout=20,  # seconds to wait for a connection
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)


async def get_async_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


AsyncDbSessionDep = Annotated[AsyncSession, Depends(get_async_db_session)]

connection_count = 0


@asynccontextmanager
async def async_db_session_context():
    async with AsyncSessionLocal() as session:
        global connection_count
        connection_count += 1
        yield session
        connection_count -= 1
