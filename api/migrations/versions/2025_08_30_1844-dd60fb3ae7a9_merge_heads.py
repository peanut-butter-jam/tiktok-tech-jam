"""Merge heads

Revision ID: dd60fb3ae7a9
Revises: 83c8bc13eed2, 3928851b22ec
Create Date: 2025-08-30 18:44:40.084042

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dd60fb3ae7a9'
down_revision: Union[str, None] = ('83c8bc13eed2', '3928851b22ec')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
