from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict
from rou_dto import RouDto


class RegulationDTO(BaseModel):
    """
    Data Transfer Object for Regulation
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str = Field(...)
    file_object_id: UUID | None = Field(...)


class CreateRegulationDTO(RegulationDTO):
    """
    DTO for creating a new Regulation
    """


class GetRegulationDTO(RegulationDTO):
    """
    DTO for retrieving a Regulation
    """

    created_at: datetime = Field(...)
    updated_at: datetime = Field(...)
    rous: list[RouDto] | None = Field(...)
