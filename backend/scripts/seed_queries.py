# backend/scripts/seed_queries.py
import random
import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import os
import sys

# nếu chạy từ project root, thêm backend vào sys.path
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
sys.path.insert(0, ROOT)

from app.database import SessionLocal
from app.models.user import User
from app.models.document import Query as QueryModel  # Query class nằm trong document.py trong project bạn
from app.utils.security import get_password_hash  # nếu bạn muốn tạo user mẫu với mật khẩu hashed
from sqlalchemy import select

def make_sample_text(i):
    return f"Câu hỏi mẫu số {i}: nội dung test về Luật/GD/Chính sách #{i}"

def make_sources():
    # tạo 0-2 source mẫu
    s = []
    for _ in range(random.randint(0,2)):
        s.append({
            "document_id": random.randint(1,6),
            "chunk_index": random.randint(0,10),
            "similarity_score": round(random.random(), 3),
            "text": "Nội dung trích dẫn mẫu..."
        })
    return s

def seed():
    db: Session = SessionLocal()
    try:
        # tạo 3 user mẫu nếu chưa có
        emails = ["user1@example.com","user2@example.com","user3@example.com"]
        users = {}
        for e in emails:
            user = db.query(User).filter(User.email == e).first()
            if not user:
                user = User(email=e, hashed_password=get_password_hash("Test12345"), full_name=e.split('@')[0])
                db.add(user)
                db.commit()
                db.refresh(user)
            users[e] = user

        # mỗi user: chèn 8-12 queries phân bố thời gian khác nhau, rating khác nhau
        now = datetime.utcnow()
        total_inserted = 0
        for idx, (email,user) in enumerate(users.items(), start=1):
            count = random.randint(8,12)
            for i in range(count):
                q = QueryModel(
                    user_id=user.id,
                    query_text=make_sample_text(i + idx*100),
                    response_text="Đây là câu trả lời giả lập cho test.",
                    sources=make_sources(),
                    created_at = now - timedelta(days=random.randint(0,10), hours=random.randint(0,23)),
                    execution_time = random.randint(5,500),
                    rating = random.choice([None, 1,2,3,4,5])
                )
                db.add(q)
                total_inserted += 1
            db.commit()
        print(f"Seed xong — đã chèn {total_inserted} bản ghi cho {len(users)} user.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
