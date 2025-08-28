from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from rou_dto import RouDto


class RegulationDTO(BaseModel):
    """
    Data Transfer Object for Regulation
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str = Field(..., description="The title of the regulation")
    file_object_id: str = Field(..., description="The ID of the associated file object")
    rous: Optional[list[RouDto]] = Field(
        ..., description="List of associated Regulatory Obligation Units (ROUs)"
    )
    created_at: datetime = Field(..., description="The creation date of the regulation")
