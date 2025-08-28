from typing import List
from pydantic import BaseModel, Field


class ExtractedRouDto(BaseModel):
    canonical_text: str = Field(..., description="The key regulatory requirement in concise form")
    desc: str = Field(..., description="A short human-friendly description of the ROU")
    obligations: list[str] = Field(..., description="The specific actions or duties required")
    jurisdiction: str = Field(..., description="The country or region this ROU applies to")


class ExtractionResult(BaseModel):
    rous: List[ExtractedRouDto] = Field(..., description="List of extracted ROU")


class DedupResult(BaseModel):
    rous: List[ExtractedRouDto] = Field(..., description="List of deduplicated ROU")
