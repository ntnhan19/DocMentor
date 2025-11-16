# backend/scripts/seed_queries.py
import random
from datetime import datetime, timedelta
import os
import sys
from sqlalchemy.orm import Session

# Add backend to PYTHONPATH
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
sys.path.insert(0, ROOT)

from app.database import SessionLocal
from app.models.user import User
from app.models.document import Query as QueryModel
from app.utils.security import get_password_hash


# ==========================
# Helper functions
# ==========================
def random_text(i: int):
    return f"Câu hỏi seed #{i}: nội dung kiểm thử RAG."

def random_sources():
    s = []
    for _ in range(random.randint(1, 3)):
        s.append({
            "document_id": random.randint(1, 5),
            "chunk_index": random.randint(0, 12),
            "similarity_score": round(random.uniform(0.30, 0.95), 3),
            "text": "Nội dung mẫu được trích từ tài liệu...",
        })
    return s


# ==========================
# Main seeding process
# ==========================
def seed():
    db: Session = SessionLocal()

    print("\n🌱 START SEEDING QUERY DATA...\n")

    try:
        # Create sample users
        sample_users = [
            ("user1@example.com", "User One"),
            ("user2@example.com", "User Two"),
            ("user3@example.com", "User Three")
        ]
        users = {}

        print("👤 Checking/creating users...")

        for email, name in sample_users:
            user = db.query(User).filter(User.email == email).first()

            if not user:
                print(f"   → Creating user: {email}")
                user = User(
                    email=email,
                    full_name=name,
                    hashed_password=get_password_hash("Test12345")
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            else:
                print(f"   → User exists: {email}")

            users[email] = user

        print("\n📝 Creating queries for each user...\n")

        total_count = 0
        now = datetime.utcnow()

        for idx, (email, user) in enumerate(users.items(), start=1):
            add_count = random.randint(8, 12)
            print(f"   → {email}: Adding {add_count} queries...")

            for i in range(add_count):
                q = QueryModel(
                    user_id=user.id,
                    query_text=random_text(i + idx * 100),
                    response_text="Đây là câu trả lời giả lập do script seed tạo.",
                    sources=random_sources(),
                    created_at=now - timedelta(days=random.randint(1, 7)),
                    execution_time=random.randint(10, 500),
                    rating=random.choice([None, 1, 2, 3, 4, 5]),
                    feedback=None
                )
                db.add(q)
                total_count += 1

            db.commit()

        print(f"\n✅ SEED COMPLETE — Inserted {total_count} queries for {len(users)} users.\n")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
