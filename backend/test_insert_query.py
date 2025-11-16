from app.database import SessionLocal
from app.models.document import Query
from datetime import datetime

db = SessionLocal()

query = Query(
    user_id=2,
    query_text="Sample query",
    response_text="Sample answer",
    sources=[],
    created_at=datetime.utcnow(),
    execution_time=123
)

db.add(query)
db.commit()
db.refresh(query)

print("Inserted query id:", query.id)
