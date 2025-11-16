from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import List, Dict, Any, Optional
import re


# ============================================================
# REQUEST SCHEMAS
# ============================================================

class QueryRequest(BaseModel):
    query_text: str = Field(..., min_length=5, max_length=500)
    document_ids: List[int] = Field(..., min_items=1)
    max_results: int = Field(default=5, ge=1, le=10)


# ============================================================
# FEEDBACK SCHEMAS
# ============================================================

class QueryFeedbackBase(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating từ 1-5 sao")
    feedback_text: Optional[str] = Field(None, max_length=500)

    @field_validator("feedback_text")
    @classmethod
    def clean_feedback(cls, v):
        if v:
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
# RESPONSE SCHEMAS
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
