"""Add `doc_metadata` JSON column to `documents` table if it doesn't exist.

Run from `backend` with the project's venv activated:
  .\venv_support\Scripts\python.exe scripts\add_doc_metadata_column.py
"""
from sqlalchemy import text
from app.database import engine

SQL = """
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS doc_metadata JSON;
"""

def main():
    print("Connecting to DB and applying ALTER TABLE if needed...")
    with engine.begin() as conn:
        conn.execute(text(SQL))
    print("Done: ensured doc_metadata column exists on documents table")

if __name__ == '__main__':
    main()
