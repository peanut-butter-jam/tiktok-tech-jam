from typing import TYPE_CHECKING
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.schemas.mixins.serial_id_mixin import SerialIdMixin
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base
from uuid import UUID

from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey

from typing import List

if TYPE_CHECKING:
    from app.database.schemas.rou import RegulatoryObligationUnit
    from app.database.schemas.file_object import FileObject
    from app.database.schemas.check_regulation import CheckRegulation


class Regulation(Base, SerialIdMixin, TimestampMixin):
    __tablename__ = "regulations"

    title: Mapped[str] = mapped_column(Text, nullable=False)

    file_object_id: Mapped[UUID] = mapped_column(
        ForeignKey("file_objects.id"), nullable=False, unique=True
    )

    file_object: Mapped["FileObject"] = relationship("FileObject", back_populates="regulation")
    rous: Mapped[List["RegulatoryObligationUnit"]] = relationship(
        "RegulatoryObligationUnit", back_populates="source"
    )
    check_regulations: Mapped[List["CheckRegulation"]] = relationship(
        "CheckRegulation", back_populates="regulation"
    )
