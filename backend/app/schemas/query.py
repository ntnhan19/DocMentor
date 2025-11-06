from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Dict, Any, Optional

# Request schemas
class QueryRequest(BaseModel):
    query_text: str = Field(..., min_length=5, max_length=500)
    document_ids: List[int] = Field(..., min_items=1)
    max_results: int = Field(default=5, ge=1, le=10)

class QueryFeedback(BaseModel):
    query_id: int
    rating: int = Field(..., ge=1, le=5)  # 1-5 stars
    feedback_text: Optional[str] = None

# Response schemas
class SourceChunk(BaseModel):
    document_id: int
    document_title: str
    chunk_index: int
    text: str
    page_number: int
    similarity_score: float

class QueryResponse(BaseModel):
    query_id: int
    query_text: str
    answer: str
    sources: List[SourceChunk]
    processing_time_ms: int
    confidence_score: float
    created_at: datetime

class QueryHistory(BaseModel):
    queries: List[QueryResponse]
    total: int