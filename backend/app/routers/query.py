from fastapi import APIRouter, Depends, HTTPException, status, Query as QueryParam, BackgroundTasks
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import func, cast, Date, desc, asc
from datetime import datetime, timedelta, time
from typing import Optional

# (Database and other imports remain same...)
from ..database import get_db
from ..models.feedback import Feedback
from ..models.conversation import Conversation
from ..models.user import User
from ..models.document import Query as QueryModel
from ..schemas.query import QueryRequest, QueryResponse, QueryHistory, QueryFeedbackCreate
from ..services.rag_service_gemini import RAGServiceGemini
from ..utils.security import get_current_user

router = APIRouter(prefix="/query", tags=["Query & RAG"])

from fastapi.responses import StreamingResponse
import json

@router.post("/")
async def query_documents(
    request: QueryRequest,
    background_tasks: BackgroundTasks,
    conversation_id: Optional[int] = QueryParam(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Send query to RAG service and return a StreamingResponse (SSE).
    """
    # Validate conversation ownership if provided
    if conversation_id:
        from ..models.conversation import Conversation
        from fastapi import HTTPException, status
        
        conversation = db.query(Conversation).filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id
        ).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or not owned by you"
            )

    rag_service = RAGServiceGemini()

    async def stream_generator():
        async for chunk in rag_service.query_documents_stream(
            db=db,
            user=current_user,
            query_text=request.query_text,
            document_ids=request.document_ids,
            max_results=request.max_results,
            conversation_id=conversation_id,
            background_tasks=background_tasks
        ):
            # SSE Format: data: <json>\n\n
            yield f"data: {chunk}\n\n"

    return StreamingResponse(
        stream_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no" # Quan trọng cho Nginx/Render
        }
    )


# ==========================================================
# 2) GET QUERY HISTORY
# ==========================================================
@router.get("/history", response_model=QueryHistory)
def get_query_history(
    skip: int = QueryParam(0, ge=0),
    limit: int = QueryParam(20, ge=1, le=100),
    date_from: Optional[str] = QueryParam(None),
    date_to: Optional[str] = QueryParam(None),
    search: Optional[str] = QueryParam(None),
    sort_by: Optional[str] = QueryParam("date", regex="^(date|rating|relevance)$"),
    order: Optional[str] = QueryParam("desc", regex="^(asc|desc)$"),
    conversation_id: Optional[int] = QueryParam(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ⭐ ADD EAGER LOADING to avoid N+1
    # Sử dụng dấu ngoặc bao quanh để tránh SyntaxError
    q = (
        db.query(QueryModel)
        .options(
            selectinload(QueryModel.documents),   # Đảm bảo QueryModel có relationship 'documents'
            selectinload(QueryModel.feedbacks),   # Đảm bảo QueryModel có relationship 'feedbacks'
            joinedload(QueryModel.user),          # Đảm bảo QueryModel có relationship 'user'
        )
        .filter(QueryModel.user_id == current_user.id)
    )

    # Filter by Conversation ID
    if conversation_id:
        q = q.filter(QueryModel.conversation_id == conversation_id)

    # Date filters
    try:
        if date_from:
            start_date = datetime.strptime(date_from, "%Y-%m-%d")
            q = q.filter(QueryModel.created_at >= datetime.combine(start_date.date(), time.min))
        if date_to:
            end_date = datetime.strptime(date_to, "%Y-%m-%d")
            q = q.filter(QueryModel.created_at <= datetime.combine(end_date.date(), time.max))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format, use YYYY-MM-DD")

    # Search
    if search:
        safe = search.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        q = q.filter(QueryModel.query_text.ilike(f"%{safe}%", escape="\\"))

    # Sorting
    sort_col = QueryModel.created_at
    if sort_by == "rating":
        sort_col = QueryModel.rating
    elif sort_by == "relevance":
        sort_col = QueryModel.created_at # Hoặc cột logic khác nếu có

    if order == "desc":
        q = q.order_by(desc(sort_col))
    else:
        q = q.order_by(asc(sort_col))

    # Total & Pagination
    total = q.count()
    items = q.offset(skip).limit(limit).all()

    formatted = []
    for row in items:
        sources = row.sources or []
        if isinstance(sources, dict) and "sources" in sources:
            sources = sources["sources"]
        elif not isinstance(sources, list):
            sources = []

        normalized_sources = [
            {
                "document_id": s.get("document_id"),
                "document_title": s.get("document_title"),
                "page_number": s.get("page_number"),
                "similarity_score": s.get("similarity_score"),
                "text": s.get("text"),
            }
            for s in sources if isinstance(s, dict)
        ]

        formatted.append({
            "query_id": row.id,
            "query_text": row.query_text,
            "answer": row.response_text or "",
            "sources": normalized_sources,
            "processing_time_ms": row.execution_time or 0,
            "confidence_score": 0.0,
            "created_at": row.created_at,
        })

    return {"queries": formatted, "total": total}


# ==========================================================
# 3) STATISTICS (GET /query/stats)
# ==========================================================
@router.get("/stats")
def get_query_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1️⃣ Single aggregated query: total + avg rating
    totals = (
        db.query(
            func.count(QueryModel.id).label("total"),
            func.avg(QueryModel.rating).label("avg_rating")
        )
        .filter(QueryModel.user_id == current_user.id)
        .first()
    )

    total_queries = int(totals.total or 0)
    avg_rating_numeric = totals.avg_rating
    avg_rating = round(float(avg_rating_numeric), 2) if avg_rating_numeric else 0.0

    # 2️⃣ Activity 7 ngày gần đây
    now = datetime.utcnow()
    start_dt = datetime.combine((now.date() - timedelta(days=6)), time.min)

    rows = (
        db.query(
            cast(QueryModel.created_at, Date).label("day"),
            func.count(QueryModel.id).label("cnt")
        )
        .filter(QueryModel.user_id == current_user.id)
        .filter(QueryModel.created_at >= start_dt)
        .group_by(cast(QueryModel.created_at, Date))
        .order_by(cast(QueryModel.created_at, Date))
        .all()
    )

    day_map = {r.day: int(r.cnt) for r in rows}

    activity = []
    for i in range(7):
        d = now.date() - timedelta(days=6 - i)
        activity.append({
            "date": d.isoformat(),
            "count": day_map.get(d, 0)
        })

    return {
        "total_queries": total_queries,
        "avg_rating": avg_rating,
        "activity_last_7_days": activity
    }


# ==========================================================
# 4) GET QUERY DETAIL
# ==========================================================
@router.get("/{query_id}", response_model=QueryResponse)
def get_query_detail(
    query_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query_record = (
        db.query(QueryModel)
        .filter(QueryModel.id == query_id, QueryModel.user_id == current_user.id)
        .first()
    )
    if not query_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Query not found")

    # Normalize sources
    sources = query_record.sources or []
    if isinstance(sources, dict) and "sources" in sources and isinstance(sources["sources"], list):
        out_sources = sources["sources"]
    elif isinstance(sources, list):
        out_sources = sources
    else:
        out_sources = []

    normalized_sources = []
    for s in out_sources:
        if not isinstance(s, dict):
            continue
        normalized_sources.append(
            {
                "document_id": s.get("document_id"),
                "document_title": s.get("document_title"),
                "page_number": s.get("page_number"),
                "similarity_score": s.get("similarity_score"),
                "text": s.get("text"),
            }
        )

    return {
        "query_id": query_record.id,
        "query_text": query_record.query_text,
        "answer": query_record.response_text or "",
        "sources": normalized_sources,
        "processing_time_ms": query_record.execution_time or 0,
        "confidence_score": 0.0,
        "created_at": query_record.created_at,
    }


# ==========================================================
# 5) SUBMIT FEEDBACK
# ==========================================================
@router.post("/feedback", status_code=status.HTTP_200_OK)
def submit_feedback(
    feedback: QueryFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query_record = (
        db.query(QueryModel)
        .filter(QueryModel.id == feedback.query_id)
        .first()
    )
    if not query_record:
        raise HTTPException(status_code=404, detail="Query not found")

    if query_record.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: not your query")

    existing_feedback = (
        db.query(Feedback)
        .filter(Feedback.query_id == feedback.query_id)
        .first()
    )
    if existing_feedback:
        raise HTTPException(status_code=400, detail="Already submitted feedback")

    if not (1 <= feedback.rating <= 5):
        raise HTTPException(status_code=422, detail="Rating must be from 1 to 5")

    new_feedback = Feedback(
        query_id=feedback.query_id,
        user_id=current_user.id,
        rating=feedback.rating,
        feedback_text=feedback.feedback_text.strip() if feedback.feedback_text else None
    )

    db.add(new_feedback)
    
    # Cập nhật rating vào bảng Query nếu có cột rating
    if hasattr(query_record, "rating"):
        query_record.rating = feedback.rating

    db.commit()
    db.refresh(new_feedback)

    return {
        "query_id": query_record.id,
        "feedback": {
            "rating": new_feedback.rating,
            "text": new_feedback.feedback_text,
            "created_at": new_feedback.created_at.isoformat(),
            "user_id": new_feedback.user_id
        }
    }


# ==========================================================
# 6) GET FEEDBACK
# ==========================================================
@router.get("/{query_id}/feedback", status_code=200)
def get_feedback(
    query_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query_record = (
        db.query(QueryModel)
        .filter(QueryModel.id == query_id)
        .first()
    )
    if not query_record:
        raise HTTPException(status_code=404, detail="Query not found")

    if query_record.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: not your query")

    feedback = (
        db.query(Feedback)
        .filter(Feedback.query_id == query_id)
        .first()
    )

    if not feedback:
        return None

    return {
        "rating": feedback.rating,
        "text": feedback.feedback_text,
        "created_at": feedback.created_at.isoformat(),
        "user_id": feedback.user_id
    }


# ==========================================================
# 7) DELETE QUERY
# ==========================================================
@router.delete("/{query_id}", status_code=status.HTTP_200_OK)
def delete_query(
    query_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query_record = (
        db.query(QueryModel)
        .filter(QueryModel.id == query_id, QueryModel.user_id == current_user.id)
        .first()
    )
    if not query_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Query not found")

    db.delete(query_record)
    db.commit()

    return {"message": "Query deleted successfully", "deleted_id": query_id}