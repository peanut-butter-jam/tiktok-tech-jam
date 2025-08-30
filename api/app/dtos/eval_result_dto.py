from typing import List
from pydantic import BaseModel, ConfigDict, Field

from app.database.schemas import EvalResult
from app.database.schemas.enums.flag_type import FlagType


class EvalResultDTO(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    flag: FlagType = Field(
        ...,
        description="Whether the feature requires geo-specific compliance logic. "
        "'yes' = requires geo-specific logic; 'no' = does not; 'unknown' = insufficient evidence.",
    )
    reasoning: str = Field(..., description="Concise, audit-ready explanation supporting the decision.")
    require_human_review: bool = Field(
        ..., description="Whether human review is required for this evaluation."
    )
    confidence: float = Field(
        ..., description="Confidence score (0.0-1.0) based strictly on input evidence."
    )
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

    def to_db(self) -> EvalResult:
        return EvalResult(
            flag=self.flag,
            require_human_review=self.require_human_review,
            confidence=self.confidence,
            reasoning=self.reasoning,
            recommended_actions=self.recommended_actions,
            rou_ids=self.rou_ids,
            missing_information=self.missing_information,
        )


class HumanReconciledEvalResultDTO(EvalResultDTO):
    model_config = ConfigDict(from_attributes=True)

    require_human_review: bool = False
    confidence: float = 1
    recommended_actions: List[str] = []
    rou_ids: List[int] = []
    missing_information: List[str] = []
