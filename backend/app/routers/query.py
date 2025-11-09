from fastapi import APIRouter, Depends, HTTPException, status, Query as QueryParam
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.query import QueryRequest, QueryResponse, QueryHistory, QueryFeedback
from ..services.rag_service_gemini import RAGServiceGemini 
from ..utils.security import get_current_user
from ..models.user import User
from ..models.document import Query as QueryModel
from sqlalchemy import func
from pydantic import BaseModel
from datetime import datetime, timedelta

class QueryStatsResponse(BaseModel):
    total: int
    avg_rating: float | None
    daily_counts: list[dict[str, int]]
router = APIRouter(prefix="/query", tags=["Query & RAG"])

@router.post("/", response_model=QueryResponse)
async def query_documents(
    request: QueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rag_service = RAGServiceGemini()
    
    result = await rag_service.query_documents(
        db=db,
        user=current_user,
        query_text=request.query_text,
        document_ids=request.document_ids,
        max_results=request.max_results
    )

    # 🔹 Thêm bước lưu vào DB
    from app.models.document import Query as QueryModel
    new_query = QueryModel(
        user_id=current_user.id,
        query_text=request.query_text,
        response_text=result.get("answer", ""),
        sources=result.get("sources", []),
        execution_time=result.get("processing_time_ms", 0)
    )
    db.add(new_query)
    db.commit()
    db.refresh(new_query)

    # 🔹 Trả về đầy đủ schema
    return {
        "query_id": new_query.id,
        "query_text": request.query_text,
        "answer": result.get("answer", ""),
        "sources": result.get("sources", []),
        "processing_time_ms": result.get("processing_time_ms", 0),
        "confidence_score": result.get("confidence_score", 0.0),
        "created_at": new_query.created_at
    }

@router.get("/history", response_model=QueryHistory)
def get_query_history(
    skip: int = QueryParam(0, ge=0),
    limit: int = QueryParam(20, ge=1, le=100),
    date_from: str | None = QueryParam(None, description="Filter from date (YYYY-MM-DD)"),
    date_to: str | None = QueryParam(None, description="Filter to date (YYYY-MM-DD)"),
    search: str | None = QueryParam(None, description="Search text in query"),
    sort_by: str = QueryParam("date", description="Sort by: date, rating, relevance"),
    order: str = QueryParam("desc", description="Sort order: asc or desc"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get filtered, searchable, and sortable query history"""

    q = db.query(QueryModel).filter(QueryModel.user_id == current_user.id)

    # --- 1. Parse and apply date filters ---
    if date_from:
        try:
            date_from_dt = datetime.strptime(date_from, "%Y-%m-%d")
            q = q.filter(QueryModel.created_at >= date_from_dt)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date_from format. Use YYYY-MM-DD")

    if date_to:
        try:
            date_to_dt = datetime.strptime(date_to, "%Y-%m-%d") + timedelta(days=1)  # include full day
            q = q.filter(QueryModel.created_at < date_to_dt)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date_to format. Use YYYY-MM-DD")

    # --- 2. Search ---
    if search:
        q = q.filter(QueryModel.query_text.ilike(f"%{search}%"))

    # --- 3. Sorting ---
    sort_map = {
        "date": QueryModel.created_at,
        "rating": None,  # no rating column yet
        "relevance": None  # fallback to date
    }

    sort_column = sort_map.get(sort_by)
    if not sort_column:
        sort_column = QueryModel.created_at

    if order.lower() == "asc":
        q = q.order_by(sort_column.asc())
    else:
        q = q.order_by(sort_column.desc())

    # --- 4. Count total (before pagination) ---
    total = q.order_by(None).count()

    # --- 5. Pagination ---
    queries = q.offset(skip).limit(limit).all()

    # --- 6. Format response ---
    formatted_queries = []
    for q_obj in queries:
        formatted_queries.append({
            "query_id": q_obj.id,
            "query_text": q_obj.query_text,
            "answer": q_obj.response_text or "",
            "sources": q_obj.sources or [],
            "processing_time_ms": q_obj.execution_time or 0,
            "confidence_score": 0.0,
            "created_at": q_obj.created_at
        })

    return {
        "total": total,
        "queries": formatted_queries,
        "filters": {
            "date_from": date_from,
            "date_to": date_to,
            "search": search,
            "sort_by": sort_by,
            "order": order
        }
    }
    return QueryHistory(queries=formatted_queries, total=total)
@router.get("/stats", response_model=QueryStatsResponse)
def get_query_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get overall statistics for user's queries (7 days window)"""
    total = db.query(func.count(QueryModel.id)).filter(
        QueryModel.user_id == current_user.id
    ).scalar()

    # Không có cột rating → bỏ qua
    avg_rating = None

    seven_days_ago = datetime.utcnow() - timedelta(days=6)
    date_counts = db.query(
        func.date(QueryModel.created_at).label('day'),
        func.count(QueryModel.id).label('count')
    ).filter(
        QueryModel.user_id == current_user.id,
        QueryModel.created_at >= seven_days_ago
    ).group_by('day').order_by('day').all()

    daily_counts = [
        {"day": str(day), "count": count} for day, count in date_counts
    ]

    return QueryStatsResponse(
        total=total,
        avg_rating=avg_rating,
        daily_counts=daily_counts
    )

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

