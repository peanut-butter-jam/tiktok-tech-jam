from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class FileObjectDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    bucket_name: str
    path: str
    created_at: datetime
    updated_at: datetime
