from sqlalchemy import Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.schemas.mixins.serial_id_mixin import SerialIdMixin
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING, List, Dict

if TYPE_CHECKING:
    from app.database.schemas.check import Check


class Feature(Base, SerialIdMixin, TimestampMixin):
    __tablename__ = "features"

    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    terminologies: Mapped[Dict[str, str] | None] = mapped_column(JSON, nullable=True)

    checks: Mapped[List["Check"]] = relationship("Check", back_populates="feature")
