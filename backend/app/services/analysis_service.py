from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging
from ..models.document import Document
from ..models.user import User
from ..services.gemini_service import GeminiService
from ..services.document_processor import DocumentProcessor
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)

class AnalysisService:
    """Service for document analysis features"""
    
    def __init__(self):
        self.gemini_service = GeminiService()
        self.doc_processor = DocumentProcessor()
    
    async def generate_summary(
        self,
        db: Session,
        user: User,
        document_id: int,
        length: str = "medium"
    ) -> Dict[str, Any]:
        """Generate document summary"""
        try:
            # Get document
            document = db.query(Document).filter(
                Document.id == document_id,
                Document.user_id == user.id,
                Document.processed == True
            ).first()
            
            if not document:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Document not found or not processed"
                )
            
            # Extract text
            logger.info(f"📄 Extracting text from {document.file_path}")
            if document.file_path.endswith('.pdf'):
                text = self.doc_processor.extract_pdf(document.file_path)
            elif document.file_path.endswith('.docx'):
                text = self.doc_processor.extract_docx(document.file_path)
            elif document.file_path.endswith('.txt'):
                text = self.doc_processor.extract_txt(document.file_path)
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Unsupported file type"
                )
            
            if len(text) < 100:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Document too short to summarize"
                )
            
            # Generate summary
            logger.info(f"🤖 Generating {length} summary...")
            summary = await self.gemini_service.generate_summary(text, length)
            
            word_count = len(summary.split())
            
            return {
                'document_id': document.id,
                'document_title': document.title,
                'summary': summary,
                'length': length,
                'word_count': word_count
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ Error generating summary: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate summary: {str(e)}"
            )
    
    async def extract_concepts(
        self,
        db: Session,
        user: User,
        document_id: int,
        max_concepts: int = 10
    ) -> Dict[str, Any]:
        """Extract key concepts from document"""
        try:
            # Get document
            document = db.query(Document).filter(
                Document.id == document_id,
                Document.user_id == user.id,
                Document.processed == True
            ).first()
            
            if not document:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Document not found or not processed"
                )
            
            # Extract text
            logger.info(f"📄 Extracting text from {document.file_path}")
            if document.file_path.endswith('.pdf'):
                text = self.doc_processor.extract_pdf(document.file_path)
            elif document.file_path.endswith('.docx'):
                text = self.doc_processor.extract_docx(document.file_path)
            elif document.file_path.endswith('.txt'):
                text = self.doc_processor.extract_txt(document.file_path)
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Unsupported file type"
                )
            
            # Extract concepts
            logger.info(f"🔍 Extracting top {max_concepts} concepts...")
            concepts = await self.gemini_service.extract_key_concepts(text, max_concepts)
            
            return {
                'document_id': document.id,
                'document_title': document.title,
                'concepts': concepts,
                'count': len(concepts)
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ Error extracting concepts: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to extract concepts: {str(e)}"
            )
    
    async def generate_quiz(
        self,
        db: Session,
        user: User,
        document_id: int,
        num_questions: int = 5,
        difficulty: str = "medium"
    ) -> Dict[str, Any]:
        """Generate quiz from document"""
        try:
            # Get document
            document = db.query(Document).filter(
                Document.id == document_id,
                Document.user_id == user.id,
                Document.processed == True
            ).first()
            
            if not document:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Document not found or not processed"
                )
            
            # Extract text
            logger.info(f"📄 Extracting text from {document.file_path}")
            if document.file_path.endswith('.pdf'):
                text = self.doc_processor.extract_pdf(document.file_path)
            elif document.file_path.endswith('.docx'):
                text = self.doc_processor.extract_docx(document.file_path)
            elif document.file_path.endswith('.txt'):
                text = self.doc_processor.extract_txt(document.file_path)
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Unsupported file type"
                )
            
            # Generate quiz
            logger.info(f"📝 Generating {num_questions} questions ({difficulty})...")
            questions = await self.gemini_service.generate_quiz(
                text, 
                num_questions, 
                difficulty
            )
            
            if not questions:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to generate quiz questions"
                )
            
            return {
                'document_id': document.id,
                'document_title': document.title,
                'questions': questions,
                'difficulty': difficulty,
                'total_questions': len(questions)
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ Error generating quiz: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate quiz: {str(e)}"
            )