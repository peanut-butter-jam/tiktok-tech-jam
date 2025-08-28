from datetime import datetime
from typing import List
from pydantic import BaseModel, Field


from typing import List, Literal
from pydantic import BaseModel, Field
from datetime import datetime


class EvalResult(BaseModel):
    flag: Literal["yes", "no", "unknown"] = Field(
        ...,
        description="Whether the feature requires geo-specific compliance logic. "
        "'yes' = requires geo-specific logic; 'no' = does not; 'unknown' = insufficient evidence.",
    )
    require_human_review: bool = Field(
        ..., description="Whether human review is required for this evaluation."
    )
    confidence: float = Field(
        ..., description="Confidence score (0.0-1.0) based strictly on input evidence."
    )
    reasoning: str = Field(..., description="Concise, audit-ready explanation supporting the decision.")
    recommended_actions: List[str] = Field(
        default_factory=list, description="Suggested next steps for engineering/legal."
    )
    rou_ids: List[int] = Field(
        default_factory=list,
        description="List of ROU (Regulatory Obligation Unit) IDs that were matched or considered relevant.",
    )
    missing_information: List[str] = Field(
        default_factory=list,
        description="Explicit items or clarifications required to resolve uncertainty.",
    )


class Check(EvalResult):
    id: int
    # status: CheckStatus
    created_at: datetime
    updated_at: datetime
