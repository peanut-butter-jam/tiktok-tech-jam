from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.schemas.mixins.serial_id_mixin import SerialIdMixin
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base
from sqlalchemy.orm import relationship
from schemas.checks import Check
from typing import List


class Feature(Base, SerialIdMixin, TimestampMixin):
    __tablename__ = "features"

    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    checks: Mapped[List[Check]] = relationship("checks", back_populates="feature")
