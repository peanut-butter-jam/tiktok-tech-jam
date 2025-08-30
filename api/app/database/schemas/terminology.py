from sqlalchemy import Text, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.database.schemas.mixins.serial_id_mixin import SerialIdMixin
from app.database.schemas.mixins.timestamp_mixin import TimestampMixin
from app.database.schemas.base import Base


class Terminology(Base, SerialIdMixin, TimestampMixin):
    __tablename__ = "terminologies"

    key: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    value: Mapped[str] = mapped_column(Text, nullable=False)

    __table_args__ = (
        UniqueConstraint('key', 'value', name='uq_terminology_key_value'),
    )
