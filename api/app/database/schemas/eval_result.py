from typing import List, TYPE_CHECKING
from sqlalchemy import ARRAY, Boolean, Float, Integer, Text, Enum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.database.schemas.enums.flag_type import FlagType
from app.database.schemas.mixins.serial_id_mixin import SerialIdMixin
from app.database.schemas.base import Base

if TYPE_CHECKING:
    from app.database.schemas.check import Check


class EvalResult(Base, SerialIdMixin):
    __tablename__ = "eval_results"

    check_id: Mapped[int] = mapped_column(ForeignKey("checks.id"), nullable=False, unique=True)

    flag: Mapped[FlagType] = mapped_column(Enum(FlagType), nullable=False)
    require_human_review: Mapped[bool] = mapped_column(Boolean, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    reasoning: Mapped[str] = mapped_column(Text, nullable=False)
    recommended_actions: Mapped[List[str]] = mapped_column(ARRAY(Text), nullable=False)
    rou_ids: Mapped[List[int]] = mapped_column(ARRAY(Integer), nullable=False)
    missing_information: Mapped[List[str]] = mapped_column(ARRAY(Text), nullable=False)

    check: Mapped["Check"] = relationship("Check", back_populates="eval_result")
