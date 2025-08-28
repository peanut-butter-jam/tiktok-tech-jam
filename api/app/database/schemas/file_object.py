from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.mixins.uuid_mixin import UuidMixin
from app.database.schemas.base import Base
from sqlalchemy.orm import relationship
from api.app.database.schemas.regulation import Regulation


class FileObject(Base, UuidMixin, TimestampMixin):
    __tablename__ = "file_objects"

    bucket_name: Mapped[str] = mapped_column(String(100), nullable=False)
    path: Mapped[str] = mapped_column(Text, nullable=False)

    regulation: Mapped["Regulation"] = relationship(
        "regulations", back_populates="file_object", uselist=False
    )
