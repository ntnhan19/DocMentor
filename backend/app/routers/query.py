from fastapi import APIRouter, Depends, HTTPException, status, Query as QueryParam
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.query import QueryRequest, QueryResponse, QueryHistory, QueryFeedback
from ..services.rag_service_gemini import RAGServiceGemini 
from ..utils.security import get_current_user
from ..models.user import User
from ..models.document import Query as QueryModel

router = APIRouter(prefix="/query", tags=["Query & RAG"])

@router.post("/", response_model=QueryResponse)
async def query_documents(
    request: QueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Query documents using natural language
    Powered by Google Gemini AI
    """
    rag_service = RAGServiceGemini() 
    
    result = await rag_service.query_documents(
        db=db,
        user=current_user,
        query_text=request.query_text,
        document_ids=request.document_ids,
        max_results=request.max_results
    )
    
    from datetime import datetime
    return {
        **result,
        'query_text': request.query_text,
        'created_at': datetime.utcnow()
    }

@router.get("/history", response_model=QueryHistory)
def get_query_history(
    skip: int = QueryParam(0, ge=0),
    limit: int = QueryParam(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get query history for current user"""
    rag_service = RAGServiceGemini()
    queries = rag_service.get_user_query_history(db, current_user, skip, limit)
    
    formatted_queries = []
    for q in queries:
        formatted_queries.append({
            'query_id': q.id,
            'query_text': q.query_text,
            'answer': q.response_text,
            'sources': q.sources or [],
            'processing_time_ms': q.execution_time or 0,
            'confidence_score': 0.0,
            'created_at': q.created_at
        })
    
    total = db.query(QueryModel).filter(
        QueryModel.user_id == current_user.id
    ).count()
    
    return QueryHistory(queries=formatted_queries, total=total)

@router.get("/{query_id}", response_model=QueryResponse)
def get_query_detail(
    query_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get details of a specific query"""
    query = db.query(QueryModel).filter(
        QueryModel.id == query_id,
        QueryModel.user_id == current_user.id
    ).first()
    
    if not query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Query not found"
        )
    
    return {
        'query_id': query.id,
        'query_text': query.query_text,
        'answer': query.response_text,
        'sources': query.sources or [],
        'processing_time_ms': query.execution_time or 0,
        'confidence_score': 0.0,
        'created_at': query.created_at
    }

@router.post("/feedback")
def submit_feedback(
    feedback: QueryFeedback,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit feedback for a query"""
    query = db.query(QueryModel).filter(
        QueryModel.id == feedback.query_id,
        QueryModel.user_id == current_user.id
    ).first()
    
    if not query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Query not found"
        )
    
    if not query.sources:
        query.sources = {}
    
    query.sources['feedback'] = {
        'rating': feedback.rating,
        'text': feedback.feedback_text
    }
    
    db.commit()
    
    return {"message": "Feedback submitted successfully"}

@router.delete("/{query_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_query(
    query_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a query from history"""
    query = db.query(QueryModel).filter(
        QueryModel.id == query_id,
        QueryModel.user_id == current_user.id
    ).first()
    
    if not query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Query not found"
        )
    
    db.delete(query)
    db.commit()
    
    return None