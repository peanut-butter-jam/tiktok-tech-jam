from typing import List
from pydantic import BaseModel, Field


class Mapping(BaseModel):
    key: str = Field(..., description="The short form (e.g., abbreviation or acronym)")
    value: str = Field(..., description="The corresponding full form")


class TermMappingResultDTO(BaseModel):
    """Structured output for terminology mappings"""

    mappings: List[Mapping] = Field(
        ..., description="List of mappings from short forms to their full forms"
    )
