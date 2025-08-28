from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from check_dto import CheckDTO


class FeatureDTO(BaseModel):
    """
    Data Transfer Object for Feature
    """

    mdel_config = ConfigDict(from_attributes=True)

    id: int
    title: str = Field(..., description="The name of the feature")
    description: str = Field(..., description="A brief description of the feature")
    checks: list[CheckDTO] = Field(
        ..., description="List of associated checks for this feature"
    )
    created_at: datetime = Field(..., description="The creation date of the feature")
