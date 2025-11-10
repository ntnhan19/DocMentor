"""rename doc_metadata to metadata

Revision ID: 9005fda2a59b
Revises: d6c9c555cf07
Create Date: 2025-10-26 00:29:08.250108

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9005fda2a59b'
down_revision: Union[str, Sequence[str], None] = 'd6c9c555cf07'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
