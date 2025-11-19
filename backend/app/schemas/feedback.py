from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FeedbackBase(BaseModel):
    rating: int
    feedback_text: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    query_id: int

class FeedbackResponse(FeedbackBase):
    id: int
    user_id: int
    query_id: int
    created_at: datetime

    class Config:
        orm_mode = True
