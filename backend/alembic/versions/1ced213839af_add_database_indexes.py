"""add database indexes

Revision ID: <AUTO_GENERATED_ID>
Revises: <LAST_REVISION_ID>
Create Date: 2025-11-17
"""
from alembic import op
import sqlalchemy as sa

revision = '1ced213839af'
down_revision = '7ec222ae135d'
branch_labels = None
depends_on = None

def upgrade():
    # Documents table
    op.create_index(
        'idx_documents_user_id',
        'documents',
        ['user_id']
    )
    op.create_index(
        'idx_documents_processed',
        'documents',
        ['processed']
    )
    op.create_index(
        'idx_documents_created_at',
        'documents',
        ['created_at']
    )

    # Queries table
    op.create_index(
        'idx_queries_user_id',
        'queries',
        ['user_id']
    )
    op.create_index(
        'idx_queries_created_at',
        'queries',
        ['created_at']
    )

    # Feedbacks table
    op.create_index(
        'idx_feedbacks_query_id',
        'feedbacks',
        ['query_id']
    )


def downgrade():
    # Drop indexes in reverse order
    op.drop_index('idx_feedbacks_query_id', table_name="feedbacks")
    op.drop_index('idx_queries_created_at', table_name="queries")
    op.drop_index('idx_queries_user_id', table_name="queries")
    op.drop_index('idx_documents_created_at', table_name="documents")
    op.drop_index('idx_documents_processed', table_name="documents")
    op.drop_index('idx_documents_user_id', table_name="documents")
