from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..schemas.document import (
    DocumentResponse, 
    DocumentList, 
    DocumentUploadResponse,
    DocumentUpdate,
    DocumentStats
)
from ..services.document_service import DocumentService
from ..utils.security import get_current_user
from ..models.user import User
from ..models.document import Document

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a new document
    
    - **file**: Document file (PDF, DOCX, TXT)
    - **title**: Optional custom title (defaults to filename)
    """
    document = await DocumentService.upload_document(db, file, current_user, title)
    
    return DocumentUploadResponse(
    message="Document uploaded successfully",
    document=DocumentResponse.model_validate({
        "id": document.id,
        "title": document.title,
        "file_path": document.file_path,
        "file_type": document.file_type,
        "file_size": document.file_size,
        "processed": document.processed,
        "created_at": document.created_at,
        "updated_at": document.updated_at,
        "doc_metadata": dict(document.doc_metadata or {}),
        "user_id": document.user_id
    })
)


@router.get("/", response_model=DocumentList)
def get_documents(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all documents for current user
    
    - **skip**: Number of documents to skip (pagination)
    - **limit**: Maximum number of documents to return
    - **search**: Search by title (optional)
    """
    documents = DocumentService.get_user_documents(db, current_user, skip, limit, search)
    total = db.query(Document).filter(Document.user_id == current_user.id).count()
    
    return DocumentList(total=total, documents=documents)

@router.get("/stats", response_model=DocumentStats)
def get_document_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get document statistics for current user"""
    return DocumentService.get_user_stats(db, current_user)

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get single document by ID"""
    return DocumentService.get_document_by_id(db, document_id, current_user)

@router.put("/{document_id}", response_model=DocumentResponse)
def update_document(
    document_id: int,
    document_update: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update document metadata"""
    return DocumentService.update_document(
        db, 
        document_id, 
        current_user,
        title=document_update.title,
        metadata=document_update.metadata
    )

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete document"""
    DocumentService.delete_document(db, document_id, current_user)
    return None