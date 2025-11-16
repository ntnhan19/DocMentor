from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import List, Dict, Any, Optional
from typing import Optional
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator
import re
# ============================================================
# 1️⃣ REQUEST SCHEMAS — người dùng gửi yêu cầu
class QueryRequest(BaseModel):
    query_text: str = Field(..., min_length=5, max_length=500)
    document_ids: List[int] = Field(..., min_items=1)
    max_results: int = Field(default=5, ge=1, le=10)


# ============================================================
# 2️⃣ FEEDBACK SCHEMAS — người dùng đánh giá câu trả lời
# ============================================================

class QueryFeedbackBase(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating từ 1-5 sao")
    feedback_text: Optional[str] = Field(None, max_length=500)

    @validator("feedback_text")
    def clean_feedback(cls, v):
        if v:
            # Xóa HTML/script để tránh XSS
            v = re.sub(r"<[^>]*>", "", v)
            v = v.strip()
        return v


class QueryFeedbackCreate(QueryFeedbackBase):
    query_id: int


class QueryFeedback(QueryFeedbackBase):
    id: int
    query_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# 3️⃣ RESPONSE SCHEMAS — server trả dữ liệu về
# ============================================================

class SourceSchema(BaseModel):
    document_id: int
    document_title: Optional[str] = None
    page_number: Optional[int] = None
    similarity_score: Optional[float] = None
    text: Optional[str] = None


class QueryResponse(BaseModel):
    query_id: int
    query_text: str
    answer: str
    sources: List[SourceSchema]
    processing_time_ms: int
    confidence_score: float
    created_at: datetime


class QueryHistory(BaseModel):
    queries: List[QueryResponse]
    total: int

