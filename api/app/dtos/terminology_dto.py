from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

from app.database.schemas.terminology import Terminology


class TerminologyCreateDTO(BaseModel):
    """
    Data Transfer Object for creating a Terminology
    """

    key: str = Field(..., description="The terminology key")
    value: str = Field(..., description="The terminology value")

    def to_db(self) -> Terminology:
        return Terminology(
            key=self.key,
            value=self.value,
        )


class TerminologyDTO(TerminologyCreateDTO):
    """
    Data Transfer Object for Terminology
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime