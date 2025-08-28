from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.schemas.mixins.serial_id_mixin import SerialIdMixin
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base
from api.app.database.schemas.check import Check
from api.app.database.schemas.regulation import Regulation


class CheckRegulation(Base, SerialIdMixin, TimestampMixin):
    __tablename__ = "checks_regulations"

    check_id: Mapped[int] = mapped_column(ForeignKey("checks.id"), nullable=False)
    regulation_id: Mapped[int] = mapped_column(
        ForeignKey("regulations.id"), nullable=False
    )

    check: Mapped[Check] = relationship("checks", back_populates="checks_regulations")
    regulation: Mapped[Regulation] = relationship(
        "regulations", back_populates="checks_regulations"
    )
