from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.schemas.mixins.serial_id_mixin import SerialIdMixin
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base
from sqlalchemy.dialects.postgresql import UUID
from schemas.file_object import FileObject
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from schemas.rou import ROU


class Regulation(Base, SerialIdMixin, TimestampMixin):
    __tablename__ = "regulations"

    title: Mapped[str] = mapped_column(Text, nullable=False)

    file_object_id: Mapped[UUID] = mapped_column(
        ForeignKey("file_objects.id"), nullable=False, unique=True
    )
    file_object: Mapped[FileObject] = relationship(
        "file_objects", back_populates="regulations"
    )

    rous: Mapped[ROU] = relationship(
        "regulatory_obligation_units", backref="regulations"
    )
