from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any

# Request schemas
class DocumentCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)

class DocumentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    
    metadata: Optional[Dict[str, Any]] = None

class DocumentResponse(BaseModel):
    id: int
    user_id: int
    title: str
    file_path: str
    file_type: str
    file_size: int
    metadata_: Optional[Dict[str, Any]] = None
    processed: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class DocumentList(BaseModel):
    total: int
    documents: List[DocumentResponse]

class DocumentUploadResponse(BaseModel):
    message: str
    document: DocumentResponse

class DocumentStats(BaseModel):
    total_documents: int
    total_size: int  # bytes
    by_type: Dict[str, int]
    processed_count: int
    unprocessed_count: int