from sqlalchemy.orm import Session
from sqlalchemy import func, String, cast
from fastapi import HTTPException, status, UploadFile
from typing import List, Dict, Optional
import os
import shutil
from ..models.document import Document
from ..models.user import User
from ..schemas.document import DocumentResponse, DocumentStats
from ..utils.helpers import (
    validate_file_type, 
    validate_file_size, 
    generate_unique_filename,
    ensure_upload_dir,
    calculate_file_hash
)

class DocumentService:
    @staticmethod
    async def upload_document(
        db: Session,
        file: UploadFile,
        user: User,
        title: Optional[str] = None
    ) -> Document:
        """Upload and save document"""
        
        # Validate file type
        file_ext = validate_file_type(file.filename)
        
        # Read file to get size
        content = await file.read()
        file_size = len(content)
        
        # Validate file size
        validate_file_size(file_size)
        
        # Generate unique filename
        unique_filename = generate_unique_filename(user.id, file.filename)
        
        # Ensure upload directory exists
        upload_dir = ensure_upload_dir()
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        
        # Calculate file hash
        file_hash = calculate_file_hash(file_path)
        
        # Check for duplicate uploads based on file hash
        existing_doc = db.query(Document).filter(
            Document.user_id == user.id,
            Document.metadata_["file_hash"].as_string() == file_hash
        ).first()
        
        if existing_doc:
            # Remove duplicate file
            os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This file has already been uploaded"
            )
        
        # Create Document record
        document = Document(
            user_id=user.id,
            title=title or file.filename,
            file_path=file_path,
            file_type=file_ext[1:],
            file_size=file_size,
            metadata_={  
                "original_filename": file.filename,
                "file_hash": file_hash,
                "mime_type": file.content_type
            },
            processed=False
        )
        
        db.add(document)
        db.commit()
        db.refresh(document)
        
        return document
    
    @staticmethod
    def get_user_documents(
        db: Session,
        user: User,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None
    ) -> List[Document]:
        """Get all documents for a user with pagination"""
        query = db.query(Document).filter(Document.user_id == user.id)
        
        if search:
            query = query.filter(Document.title.ilike(f"%{search}%"))
        
        return query.order_by(Document.created_at.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_document_by_id(db: Session, document_id: int, user: User) -> Document:
        """Get single document by ID"""
        document = db.query(Document).filter(
            Document.id == document_id,
            Document.user_id == user.id
        ).first()
        
        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found"
            )
        
        return document
    
    @staticmethod
    def update_document(
        db: Session,
        document_id: int,
        user: User,
        title: Optional[str] = None,
        metadata: Optional[Dict] = None
    ) -> Document:
        """Update document metadata"""
        document = DocumentService.get_document_by_id(db, document_id, user)
        
        if title:
            document.title = title
        
        if metadata:
            if not document.metadata_:
                document.metadata_ = {}
            document.metadata_.update(metadata)
        
        db.commit()
        db.refresh(document)
        
        return document
    
    @staticmethod
    def delete_document(db: Session, document_id: int, user: User) -> bool:
        """Delete document"""
        document = DocumentService.get_document_by_id(db, document_id, user)
        
        if os.path.exists(document.file_path):
            os.remove(document.file_path)
        
        db.delete(document)
        db.commit()
        
        return True
    
    @staticmethod
    def get_user_stats(db: Session, user: User) -> DocumentStats:
        """Get document statistics for user"""
        documents = db.query(Document).filter(Document.user_id == user.id).all()
        
        total_size = sum(doc.file_size for doc in documents)
        by_type = {}
        processed_count = 0
        
        for doc in documents:
            by_type[doc.file_type] = by_type.get(doc.file_type, 0) + 1
            
            if doc.processed:
                processed_count += 1
        
        return DocumentStats(
            total_documents=len(documents),
            total_size=total_size,
            by_type=by_type,
            processed_count=processed_count,
            unprocessed_count=len(documents) - processed_count
        )