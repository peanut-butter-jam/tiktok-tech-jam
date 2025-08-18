from pydantic import BaseModel


class CoreConfig(BaseModel):
    allow_origins: list[str]
    database_url: str
