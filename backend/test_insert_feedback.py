from app.database import SessionLocal
from app.models.feedback import Feedback
from datetime import datetime

db = SessionLocal()

new_feedback = Feedback(
    query_id=95,
    user_id=2,
    rating=5,
    feedback_text="Great answer!",
    created_at=datetime.utcnow()
)

db.add(new_feedback)
db.commit()
db.refresh(new_feedback)

print("Inserted:", new_feedback.id)
