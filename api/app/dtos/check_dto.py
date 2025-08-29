from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.database.schemas.check import Check
from app.dtos.eval_result_dto import EvalResultDTO
from app.database.schemas.enums.status import Status


class CheckCreateDTO(BaseModel):
    feature_id: int
    status: Status = Status.PENDING
    eval_result: EvalResultDTO | None = None

    def to_db(self) -> Check:
        return Check(feature_id=self.feature_id, status=self.status)


class CheckUpdateDTO(BaseModel):
    status: Status | None


class CheckDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: Status
    eval_result: EvalResultDTO | None
    created_at: datetime
    updated_at: datetime
