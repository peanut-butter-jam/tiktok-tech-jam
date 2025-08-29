from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.database.schemas.enums.rou_type import RouType


class RouDto(BaseModel):
    """
    Base class for all Regulatory Obligation Unit (ROU) DTOs.

    Attributes:
        id: The unique identifier for the ROU
        type: The type of the ROU (human or AI)
        canonical_text: The canonical text of the ROU
        obligations: A list of obligations associated with the ROU
        jurisdiction: The jurisdiction of the ROU
        source_id: The source ID of the ROU
        created_at: The creation date of the ROU
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    type: RouType
    canonical_text: str = Field(
        ..., description="The key regulatory requirement in concise form"
    )
    desc: str = Field(..., description="A short human-friendly description of the ROU")
    obligations: list[str] = Field(
        ..., description="The specific actions or duties required"
    )
    jurisdiction: str = Field(
        ..., description="The country or region this ROU applies to"
    )
    source_id: int = Field(..., description="The source ID of the ROU")
    created_at: datetime = Field(..., description="The creation date of the ROU")


class HumanRouDto(BaseModel):
    """
    DTO for human-created ROU.
    """

    type: RouType = RouType.HUMAN


class AIRouDto(BaseModel):
    """
    DTO for AI-generated ROU.
    """

    type: RouType = RouType.AI
