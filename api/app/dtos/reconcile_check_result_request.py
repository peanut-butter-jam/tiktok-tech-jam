from pydantic import BaseModel

from app.dtos.eval_result_dto import FlagType


class ReconcileCheckResultRequest(BaseModel):
    flag: FlagType
    reasoning: str
