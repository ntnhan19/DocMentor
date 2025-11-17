# backend/app/routers/query.py
from fastapi import APIRouter, Depends, HTTPException, status, Query as QueryParam
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date, desc, asc
from datetime import datetime, timedelta, time
from typing import List, Optional, Any, Dict
from sqlalchemy.orm import joinedload, selectinload

from ..database import get_db
# Adjust imports to your schemas names; we expect these to exist
from ..schemas.query import (
    QueryRequest,
    QueryResponse,
    QueryHistory,
    # prefer explicit create schema for feedback if you have it
    QueryFeedbackCreate,
)

from ..services.rag_service_gemini import RAGServiceGemini
from ..utils.security import get_current_user
from ..models.user import User
from ..models.document import Document, Query as QueryModel
from app.schemas import query

router = APIRouter(prefix="/query", tags=["Query & RAG"])


# -------------------------------
# 1) Query documents (POST /query/)
# -------------------------------
@router.post("/", response_model=QueryResponse)
async def query_documents(
    request: QueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Query tài liệu với AI (Gemini)"""
    rag_service = RAGServiceGemini()

    # Gọi RAG service
    result = await rag_service.query_documents(
        db=db,
        user=current_user,
        query_text=request.query_text,
        document_ids=request.document_ids,
        max_results=request.max_results
    )

    # Nếu RAG trả về kết quả KHÔNG có query_id → tức là không tìm thấy tài liệu
    if "query_id" not in result:
        return {
            "query_id": None,
            "query_text": request.query_text,
            "answer": result["answer"],
            "sources": result["sources"],
            "confidence_score": result["confidence_score"],
            "processing_time_ms": result["processing_time_ms"],
            "created_at": datetime.utcnow()
        }

    # Nếu OK → trả về đủ thông tin
    return {
        "query_id": result["query_id"],
        "query_text": request.query_text,
        "answer": result["answer"],
        "sources": result["sources"],
        "confidence_score": result["confidence_score"],
        "processing_time_ms": result["processing_time_ms"],
        "created_at": datetime.utcnow()
    }

@router.get("/")
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    docs = (
        db.query(Document)
        .options(joinedload(Document.user))
        .filter(Document.user_id == current_user.id)
        .all()
    )
    return docs


# -------------------------------
# 2) Get history with filters (GET /query/history)
# -------------------------------
@router.get("/history", response_model=QueryHistory)
def get_query_history(
    skip: int = QueryParam(0, ge=0),
    limit: int = QueryParam(20, ge=1, le=100),
    date_from: Optional[str] = QueryParam(None),
    date_to: Optional[str] = QueryParam(None),
    search: Optional[str] = QueryParam(None),
    sort_by: Optional[str] = QueryParam("date", regex="^(date|rating|relevance)$"),
    order: Optional[str] = QueryParam("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Optimized version:
    - Avoid N+1 problem using selectinload() + joinedload()
    - Load documents + feedback + user in 2–3 queries, not dozens
    - Keep existing filters, search, sort, pagination
    """

    # ⭐ ADD EAGER LOADING to avoid N+1
    q = (
        db.query(QueryModel)
        .options(
            selectinload(QueryModel.documents),   # load documents in batch
            selectinload(QueryModel.feedbacks),   # load feedbacks in batch (if you have relationship)
            joinedload(QueryModel.user),          # load query owner
        )
        .filter(QueryModel.user_id == current_user.id)
    )

    # parse/filter dates
    try:
        if date_from:
            start_date = datetime.strptime(date_from, "%Y-%m-%d")
            q = q.filter(QueryModel.created_at >= datetime.combine(start_date.date(), time.min))
        if date_to:
            end_date = datetime.strptime(date_to, "%Y-%m-%d")
            q = q.filter(QueryModel.created_at <= datetime.combine(end_date.date(), time.max))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format, use YYYY-MM-DD")

    # search filter
    if search:
        safe = (
            search.replace("\\", "\\\\")
            .replace("%", "\\%")
            .replace("_", "\\_")
            .replace("#", "\\#")
            .replace("/", "\\/")
        )
        q = q.filter(QueryModel.query_text.ilike(f"%{safe}%", escape="\\"))

    # sorting
    sort_col = QueryModel.created_at
    if sort_by == "rating":
        sort_col = QueryModel.rating
    elif sort_by == "relevance":
        sort_col = QueryModel.created_at

    if order == "desc":
        q = q.order_by(desc(sort_col))
    else:
        q = q.order_by(asc(sort_col))

    # ⭐ COUNT (fast, no need .all())
    total = q.count()

    # pagination
    items = q.offset(skip).limit(limit).all()

    # ⭐ KEEP YOUR EXISTING RESPONSE FORMAT
    formatted = []
    for row in items:
        sources = row.sources or []

        if isinstance(sources, dict) and "sources" in sources and isinstance(sources["sources"], list):
            out_sources = sources["sources"]
        elif isinstance(sources, list):
            out_sources = sources
        elif isinstance(sources, dict) and "feedback" in sources and not sources.get("sources"):
            out_sources = []
        else:
            out_sources = []

        normalized_sources = []
        for s in out_sources:
            if isinstance(s, dict):
                normalized_sources.append(
                    {
                        "document_id": s.get("document_id"),
                        "document_title": s.get("document_title"),
                        "page_number": s.get("page_number"),
                        "similarity_score": s.get("similarity_score"),
                        "text": s.get("text"),
                    }
                )

        formatted.append(
            {
                "query_id": row.id,
                "query_text": row.query_text,
                "answer": row.response_text or "",
                "sources": normalized_sources,
                "processing_time_ms": row.execution_time or 0,
                "confidence_score": 0.0,
                "created_at": row.created_at,
            }
        )

    return {"queries": formatted, "total": total}

# -------------------------------
# 6) Statistics (GET /query/stats)
# -------------------------------
@router.get("/stats")
def get_query_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Optimized version:
    - Reduce 3–5 DB queries -> only 2 queries
    - Use SQL aggregate functions efficiently
    - Avoid scanning JSON unless absolutely needed
    """

    # -----------------------------------------
    # 1️⃣ Single aggregated query: total + avg rating
    # -----------------------------------------
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

    # convert numeric avg → float
    avg_rating = round(float(avg_rating_numeric), 2) if avg_rating_numeric else 0.0

    # -----------------------------------------
    # 2️⃣ Activity 7 ngày gần đây
    # -----------------------------------------
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

    # Build full 7-day list
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
# -------------------------------
# 3) Get query detail (GET /query/{query_id})
# -------------------------------
@router.get("/{query_id}", response_model=QueryResponse)
def get_query_detail(
    query_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Optimized version:
    - Avoid N+1 problem using joinedload + selectinload
    - Load documents + user + feedback in 1–2 queries
    - Keep same response format as before
    """

    query = (
        db.query(QueryModel)
        .options(
            joinedload(QueryModel.user),            # load owner
            selectinload(QueryModel.documents),     # load documents in batch
            selectinload(QueryModel.feedbacks),     # load feedbacks in batch (nếu dùng FK table)
        )
        .filter(QueryModel.id == query_id, QueryModel.user_id == current_user.id)
        .first()
    )

    if not query:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Query not found")

    # ---------------------
    # Normalize sources JSON
    # ---------------------
    sources = query.sources or []

    if isinstance(sources, dict) and "sources" in sources and isinstance(sources["sources"], list):
        out_sources = sources["sources"]
    elif isinstance(sources, list):
        out_sources = sources
    else:
        out_sources = []

    normalized_sources = []
    for s in out_sources:
        if isinstance(s, dict):
            normalized_sources.append(
                {
                    "document_id": s.get("document_id"),
                    "document_title": s.get("document_title"),
                    "page_number": s.get("page_number"),
                    "similarity_score": s.get("similarity_score"),
                    "text": s.get("text"),
                }
            )

    # ---------------------
    # Unified response
    # ---------------------
    return {
        "query_id": query.id,
        "query_text": query.query_text,
        "answer": query.response_text or "",
        "sources": normalized_sources,
        "processing_time_ms": query.execution_time or 0,
        "confidence_score": 0.0,
        "created_at": query.created_at,
    }


# -------------------------------
# 4) Submit feedback (POST /query/feedback)
# -------------------------------
@router.post("/feedback", status_code=status.HTTP_200_OK)
def submit_feedback(
    feedback: QueryFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Submit rating/feedback for a query.
    - Validate query ownership (403)
    - Prevent double feedback
    - Store feedback safely in QueryModel.sources (JSON)
    - Normalize structure (list → dict)
    - Auto-fill rating column if exists
    """

    # 1️⃣ Check query exists
    query = (
        db.query(QueryModel)
        .filter(QueryModel.id == feedback.query_id)
        .first()
    )
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")

    # 2️⃣ Check permission
    if query.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: not your query")

    # 3️⃣ Prevent double feedback
    existing = query.sources
    if isinstance(existing, dict) and existing.get("feedback"):
        raise HTTPException(status_code=400, detail="Already submitted feedback")

    # 4️⃣ Validate rating server-side
    if not (1 <= feedback.rating <= 5):
        raise HTTPException(status_code=422, detail="Rating must be from 1 to 5")

    # 5️⃣ Build feedback payload
    fb_payload = {
        "rating": int(feedback.rating),
        "text": feedback.feedback_text.strip() if feedback.feedback_text else None,
        "created_at": datetime.utcnow().isoformat(),
        "user_id": current_user.id,
    }

    # 6️⃣ Normalize sources JSON
    current_sources = query.sources

    if not current_sources:
        new_sources = {"sources": [], "feedback": fb_payload}

    elif isinstance(current_sources, list):
        # Convert list → dict wrapper
        new_sources = {"sources": current_sources, "feedback": fb_payload}

    elif isinstance(current_sources, dict):
        # Ensure consistent shape
        new_sources = {
            "sources": current_sources.get("sources", []),
            "feedback": fb_payload
        }

    else:
        # Unknown format → reset safely
        new_sources = {"sources": [], "feedback": fb_payload}

    # Apply changes
    query.sources = new_sources

    # Optional: write rating column if exists
    if hasattr(query, "rating"):
        try:
            query.rating = feedback.rating
        except Exception:
            pass

    # 7️⃣ Save
    db.commit()
    db.refresh(query)

    # 8️⃣ Return unified response
    return {
        "query_id": query.id,
        "feedback": fb_payload
    }

@router.get("/{query_id}/feedback", status_code=200)
def get_feedback(
    query_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get feedback for a specific query.
    - Validate query exists
    - Validate query belongs to user (403)
    - Normalize JSON sources
    - Return feedback if exists, otherwise null
    """

    # 1️⃣ Check query exists
    query = (
        db.query(QueryModel)
        .filter(QueryModel.id == query_id)
        .first()
    )
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")

    # 2️⃣ Permission check
    if query.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: not your query")

    sources = query.sources

    # 3️⃣ Feedback not found → return null
    if not sources:
        return None

    # If sources is list → no feedback ever stored
    if isinstance(sources, list):
        return None

    # If malformed JSON → treat as no feedback
    if not isinstance(sources, dict):
        return None

    # No feedback key → return null
    if "feedback" not in sources:
        return None

    # 4️⃣ Return the feedback object
    return sources["feedback"]



# -------------------------------
# 5) Delete query (DELETE /query/{query_id})
# -------------------------------
@router.delete("/{query_id}", status_code=status.HTTP_200_OK)
def delete_query(
    query_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a query belonging to current user.
    """
    query = (
        db.query(QueryModel)
        .filter(QueryModel.id == query_id, QueryModel.user_id == current_user.id)
        .first()
    )
    if not query:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Query not found")

    db.delete(query)
    db.commit()

    return {"message": "Query deleted successfully", "deleted_id": query_id}



