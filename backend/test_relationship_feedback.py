from app.database import SessionLocal
from app.models.document import Query

db = SessionLocal()

query = db.query(Query).filter(Query.id == 95).first()

if not query:
    print("Query không tồn tại")
else:
    print("Feedback list:")
    print(query.feedback)