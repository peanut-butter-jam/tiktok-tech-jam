from sqlalchemy import ARRAY, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.schemas.enums.rou_type import RouType
from app.database.schemas.mixins.serial_id_mixin import SerialIdMixin
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base
from sqlalchemy import ForeignKey
from schemas.regulations import Regulation
from sqlalchemy.orm import relationship


class RegulatoryObligationUnit(Base, SerialIdMixin, TimestampMixin):
    __tablename__ = "regulatory_obligation_units"

    type: Mapped[RouType] = mapped_column(Enum(RouType), nullable=False)
    canonical_text: Mapped[str] = mapped_column(Text, nullable=False)
    desc: Mapped[str] = mapped_column(Text, nullable=False)
    obligations: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False)
    jurisdiction: Mapped[str] = mapped_column(String, nullable=False)
    source_id: Mapped[int] = mapped_column(ForeignKey("regulations.id"), nullable=False)

    source: Mapped[Regulation] = relationship(
        "regulations", back_populates="regulatory_obligation_units"
    )


ROU = RegulatoryObligationUnit
