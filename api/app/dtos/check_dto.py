from datetime import datetime
from pydantic import BaseModel, Field
from app.database.schemas.enums.status import Status
from regulation_dto import RegulationDTO


class CheckDTO(BaseModel):
    """
    Data Transfer Object for Check
    """

    id: int
    flag: bool = Field(
        ..., description="Indicates if the check complies with the regulation"
    )
    reasoning: str = Field(
        ..., description="Detailed reasoning behind the check's outcome"
    )

    status: Status = Field(..., description="Current status of the check (e.g.,")
    not_complying_regulations: list[RegulationDTO] = Field(
        ..., description="List of regulations that the check does not comply with"
    )
    created_at: datetime = Field(..., description="The creation date of the check")
    updated_at: datetime = Field(..., description="The last update date of the check")
