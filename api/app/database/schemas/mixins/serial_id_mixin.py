from sqlalchemy import Integer
from sqlalchemy.orm import Mapped, mapped_column


class SerialIdMixin:
    """
    Adds a serial primary key column named `id`.
    """

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
