from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.schemas.mixins.uuid_mixin import UuidMixin
from app.database.schemas.base import Base


class UserProfile(Base, UuidMixin):
    __tablename__ = "user_profiles"

    email: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
