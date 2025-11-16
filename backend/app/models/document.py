from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON, Boolean, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base


# ==========================================================
# DOCUMENT MODEL
# ==========================================================
class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False, index=True)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # pdf, docx, txt
    file_size = Column(Integer, nullable=False)

    # 🟢 CHỌN MỘT TRONG HAI — nhưng để chuẩn thì dùng doc_metadata
    metadata_ = Column("doc_metadata", JSON, nullable=True)

    processed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="documents")

    def __repr__(self):
        return f"<Document(id={self.id}, title={self.title}, processed={self.processed})>"


# ==========================================================
# QUERY MODEL
# ==========================================================
class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    query_text = Column(Text, nullable=False)
    response_text = Column(Text, nullable=True)

    # 🟢 nơi sẽ lưu sources + feedback chung
    # ví dụ:
    # {
    #   "sources": [...],
    #   "feedback": {"rating": 5, "text": "...", "created_at": "..."}
    # }
    sources = Column(JSON, default=None)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    execution_time = Column(Integer, nullable=True)

    # 🟢 rating = optional (nếu có bạn sẽ dùng)
    rating = Column(Float, nullable=True, default=None)

    # ❌ KHÔNG dùng cột feedback — vì nó gây crash Render khi schema khác
    # feedback = Column(JSON, nullable=True)

    # Relationships
    user = relationship("User", back_populates="queries")

    def __repr__(self):
        return f"<Query(id={self.id}, user_id={self.user_id}, rating={self.rating})>"
