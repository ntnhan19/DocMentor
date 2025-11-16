from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..schemas.analysis import (
    SummaryRequest,
    SummaryResponse,
    ConceptsRequest,
    ConceptsResponse,
    QuizRequest,
    QuizResponse
)
from ..services.analysis_service import AnalysisService
from ..utils.security import get_current_user
from ..models.user import User

router = APIRouter(prefix="/analysis", tags=["Document Analysis"])

@router.post("/summary", response_model=SummaryResponse)
async def generate_summary(
    request: SummaryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate document summary
    
    - **document_id**: Document to summarize
    - **length**: "short" (5 sentences), "medium" (1-2 paragraphs), "long" (detailed)
    """
    analysis_service = AnalysisService()
    
    result = await analysis_service.generate_summary(
        db=db,
        user=current_user,
        document_id=request.document_id,
        length=request.length
    )
    
    return {
        **result,
        'created_at': datetime.utcnow()
    }

@router.post("/concepts", response_model=ConceptsResponse)
async def extract_concepts(
    request: ConceptsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Extract key concepts from document
    
    - **document_id**: Document to analyze
    - **max_concepts**: Maximum number of concepts to extract (1-20)
    """
    analysis_service = AnalysisService()
    
    result = await analysis_service.extract_concepts(
        db=db,
        user=current_user,
        document_id=request.document_id,
        max_concepts=request.max_concepts
    )
    
    return result

@router.post("/quiz", response_model=QuizResponse)
async def generate_quiz(
    request: QuizRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate quiz from document
    
    - **document_id**: Document to create quiz from
    - **num_questions**: Number of questions (1-20)
    - **difficulty**: "easy", "medium", or "hard"
    """
    analysis_service = AnalysisService()
    
    result = await analysis_service.generate_quiz(
        db=db,
        user=current_user,
        document_id=request.document_id,
        num_questions=request.num_questions,
        difficulty=request.difficulty
    )
    
    return result