from typing import TYPE_CHECKING
from sqlalchemy import Enum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.database.schemas.mixins.serial_id_mixin import SerialIdMixin
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base
from app.database.schemas.enums.status import Status

if TYPE_CHECKING:
    from app.database.schemas.feature import Feature
    from app.database.schemas.eval_result import EvalResult


class Check(Base, SerialIdMixin, TimestampMixin):
    __tablename__ = "checks"

    feature_id: Mapped[int] = mapped_column(
        ForeignKey("features.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[Status] = mapped_column(Enum(Status), nullable=False, default=Status.PENDING)

    eval_result: Mapped["EvalResult"] = relationship("EvalResult", back_populates="check")
    feature: Mapped["Feature"] = relationship("Feature", back_populates="checks")
