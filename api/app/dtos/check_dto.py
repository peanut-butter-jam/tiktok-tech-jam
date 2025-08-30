from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.database.schemas.enums.check_type import CheckType
from app.database.schemas.check import Check
from app.dtos.eval_result_dto import EvalResultDTO
from app.database.schemas.enums.status import Status


class CheckCreateDTO(BaseModel):
    type: CheckType
    feature_id: int
    status: Status = Status.PENDING

    def to_db(self) -> Check:
        return Check(type=self.type, feature_id=self.feature_id, status=self.status)


class CheckUpdateDTO(BaseModel):
    status: Status | None


class CheckDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: CheckType
    status: Status
    eval_result: EvalResultDTO | None
    created_at: datetime
    updated_at: datetime
