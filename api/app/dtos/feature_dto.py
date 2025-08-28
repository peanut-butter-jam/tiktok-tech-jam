from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from check_dto import CheckDTO


class FeatureDTO(BaseModel):
    """
    Data Transfer Object for Feature
    """

    mdel_config = ConfigDict(from_attributes=True)

    id: int
    title: str = Field(...)
    description: str | None = Field(...)


class CreateFeatureDTO(FeatureDTO):
    """
    DTO for creating a new Feature
    """


class GetFeatureDTO(FeatureDTO):
    """
    DTO for retrieving a Feature
    """

    created_at: datetime | None = Field(...)
    updated_at: datetime | None = Field(...)
    checks: list[CheckDTO] | None = Field(...)
