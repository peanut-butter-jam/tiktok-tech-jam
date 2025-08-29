from datetime import datetime
from functools import cached_property
from pydantic import BaseModel, Field, ConfigDict, computed_field

from app.dtos.check_dto import CheckDTO


class FeatureCreateDTO(BaseModel):
    """
    Data Transfer Object for creating a Feature
    """

    title: str = Field(..., description="The name of the feature")
    description: str | None = Field(..., description="A brief description of the feature")


class FeatureDTO(FeatureCreateDTO):
    """
    Data Transfer Object for Feature
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class FeatureDTOWithCheck(FeatureDTO):
    """
    Data Transfer Object for Feature
    """

    model_config = ConfigDict(from_attributes=True)

    checks: list[CheckDTO] = Field(..., description="List of associated checks for this feature")

    @computed_field
    @cached_property
    def latest_check(self) -> CheckDTO | None:
        sorted_checks = sorted(self.checks, key=lambda check: check.created_at, reverse=True)
        return sorted_checks[0] if sorted_checks else None
