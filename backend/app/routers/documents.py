from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import logging
from ..database import get_db, SessionLocal
from ..schemas.document import (
    DocumentResponse, 
    DocumentList, 
    DocumentUploadResponse,
    DocumentUpdate,
    DocumentStats
)
from ..services.document_service import DocumentService
from ..services.document_processor import DocumentProcessor
from ..utils.security import get_current_user
from ..models.user import User
from ..models.document import Document

router = APIRouter(prefix="/documents", tags=["Documents"])
logger = logging.getLogger(__name__)

async def process_document_background(document_id: int, file_path: str):
    """
    Background task to process document
    IMPORTANT: Create new DB session for background task
    """
    logger.info(f"🚀 Background task STARTED for document {document_id}")
    db = SessionLocal()
    try:
        processor = DocumentProcessor()
        logger.info(f"📝 Calling processor.process_document for doc {document_id}")
        
        # ✅ Await the async function
        await processor.process_document(db, document_id, file_path)
        
        logger.info(f"✅ Background task COMPLETED for document {document_id}")
    except Exception as e:
        logger.error(f"❌ Background task FAILED for doc {document_id}: {str(e)}", exc_info=True)
        
        # Update document status to failed
        try:
            doc = db.query(Document).filter(Document.id == document_id).first()
            if doc:
                if not doc.metadata_:
                    doc.metadata_ = {}
                doc.metadata_['processing_status'] = 'failed'
                doc.metadata_['error'] = str(e)
                db.commit()
        except Exception as db_err:
            logger.error(f"❌ Failed to update error status: {str(db_err)}")
    finally:
        db.close()
        logger.info(f"🔒 DB session closed for document {document_id}")

@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload document and process in background"""
    
    logger.info(f"📤 Upload request from user {current_user.id}: {file.filename}")
    
    # Upload document
    document = await DocumentService.upload_document(db, file, current_user, title)
    
    logger.info(f"✅ Document saved to DB: ID={document.id}, Path={document.file_path}")
    
    # ✅ Add background task
    logger.info(f"⏰ Adding background task for document {document.id}")
    background_tasks.add_task(
        process_document_background,
        document.id,
        document.file_path
    )
    
    return DocumentUploadResponse(
        message="Document uploaded successfully. Processing in background...",
        document=document
    )

@router.get("/", response_model=DocumentList)
def get_documents(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all documents for current user"""
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