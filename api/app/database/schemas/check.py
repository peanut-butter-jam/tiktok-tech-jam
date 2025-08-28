from sqlalchemy import String, Text, Enum
from sqlalchemy.orm import Mapped, mapped_column
from app.database.schemas.mixins.serial_id_mixin import SerialIdMixin
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base
from app.database.schemas.enums.status import Status
from sqlalchemy import ForeignKey
from api.app.database.schemas.feature import Feature
from sqlalchemy.orm import relationship
from api.app.database.schemas.check_regulation import CheckRegulation
from typing import List


class Check(Base, SerialIdMixin, TimestampMixin):
    __tablename__ = "checks"

    flag: Mapped[bool] = mapped_column(nullable=False)
    reasoning: Mapped[str] = mapped_column(Text)
    status: Mapped[Status] = mapped_column(
        Enum(Status), nullable=False, default=Status.PENDING
    )
    feature_id: Mapped[int] = mapped_column(
        ForeignKey("features.id"), nullable=False, unique=True
    )

    feature: Mapped[Feature] = relationship("features", back_populates="checks")
    checks_regulations: Mapped[List[CheckRegulation]] = relationship(
        "checks_regulations", back_populates="check"
    )
