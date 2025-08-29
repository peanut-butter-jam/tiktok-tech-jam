from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict

from app.dtos.rou_dto import RouDto


class RegulationCreateDTO(BaseModel):
    """
    DTO for creating a new Regulation
    """

    title: str
    file_object_id: UUID


class RegulationDTO(RegulationCreateDTO):
    """
    Data Transfer Object for Regulation
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    rous: list[RouDto] | None
