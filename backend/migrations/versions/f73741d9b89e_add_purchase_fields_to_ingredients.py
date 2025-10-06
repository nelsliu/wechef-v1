"""Add purchase fields to ingredients

Revision ID: f73741d9b89e
Revises: 
Create Date: 2025-10-06 14:56:37.753139

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f73741d9b89e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('ingredients', sa.Column('purchase_cost', sa.Float(), nullable=False, server_default='0'))
    op.add_column('ingredients', sa.Column('purchase_qty', sa.Float(), nullable=False, server_default='0'))

    conn = op.get_bind()
    conn.execute(sa.text(
        """
        UPDATE ingredients
        SET purchase_qty = CASE
              WHEN purchase_qty IS NULL OR purchase_qty = 0 THEN 1
              ELSE purchase_qty
            END,
            purchase_cost = CASE
              WHEN (purchase_cost IS NULL OR purchase_cost = 0) AND unit_cost IS NOT NULL
                THEN unit_cost
              ELSE COALESCE(purchase_cost, 0)
            END
        """
    ))

    with op.batch_alter_table('ingredients') as batch_op:
        batch_op.alter_column('purchase_cost', server_default=None)
        batch_op.alter_column('purchase_qty', server_default=None)


def downgrade():
    with op.batch_alter_table('ingredients') as batch_op:
        batch_op.drop_column('purchase_qty')
        batch_op.drop_column('purchase_cost')
