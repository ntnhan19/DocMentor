"""Reset database for fresh migrations"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).resolve().parent))

from app.database import engine, Base
from sqlalchemy import text

def reset_database():
    """Drop all tables and alembic version"""
    try:
        # Drop alembic_version table
        with engine.connect() as conn:
            conn.execute(text("DROP TABLE IF EXISTS alembic_version CASCADE;"))
            conn.commit()
            print("✅ Dropped alembic_version table")
        
        # Drop all tables
        Base.metadata.drop_all(bind=engine)
        print("✅ Dropped all tables")
        
    except Exception as e:
        print(f"⚠️ Error during reset: {e}")
        print("Continuing with migrations...")

if __name__ == "__main__":
    reset_database()