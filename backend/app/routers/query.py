# backend/app/routers/query.py
from fastapi import APIRouter, Depends, HTTPException, status, Query as QueryParam
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date, desc, asc
from datetime import datetime, timedelta, time
from typing import List, Optional, Any, Dict

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
from ..models.document import Query as QueryModel
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
    Get query history for current user with:
      - pagination (skip, limit)
      - optional date range filter (YYYY-MM-DD)
      - text search (ILIKE)
      - sort_by: date|rating|relevance
      - order: asc|desc
    """
    q = db.query(QueryModel).filter(QueryModel.user_id == current_user.id)

    # parse/filter dates
    try:
        if date_from:
            start_date = datetime.strptime(date_from, "%Y-%m-%d")
            # include from midnight of start_date
            q = q.filter(QueryModel.created_at >= datetime.combine(start_date.date(), time.min))
        if date_to:
            end_date = datetime.strptime(date_to, "%Y-%m-%d")
            # include until end of date_to
            q = q.filter(QueryModel.created_at <= datetime.combine(end_date.date(), time.max))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format, use YYYY-MM-DD")

    # search (escape %, _, #, / to avoid unintentionally matching)
    if search:
        safe = (
            search.replace("\\", "\\\\")
            .replace("%", "\\%")
            .replace("_", "\\_")
            .replace("#", "\\#")
            .replace("/", "\\/")
        )
        # ILIKE with explicit escape char
        q = q.filter(QueryModel.query_text.ilike(f"%{safe}%", escape="\\"))

    # choose sort column
    sort_col = QueryModel.created_at
    if sort_by == "rating":
        # note: rating may be NULL -> ordering will put NULL first/last depending DB
        sort_col = QueryModel.rating
    elif sort_by == "relevance":
        # no real relevance column; fallback to created_at (most recent as proxy)
        sort_col = QueryModel.created_at

    if order == "desc":
        q = q.order_by(desc(sort_col))
    else:
        q = q.order_by(asc(sort_col))

    total = q.count()
    items = q.offset(skip).limit(limit).all()

    formatted = []
    for row in items:
        # normalize sources for response: ensure list of dicts or empty list
        sources = row.sources or []
        # if stored as object with 'sources' key (backcompat), try to extract list
        if isinstance(sources, dict) and "sources" in sources and isinstance(sources["sources"], list):
            out_sources = sources["sources"]
        elif isinstance(sources, list):
            out_sources = sources
        elif isinstance(sources, dict) and "feedback" in sources and not sources.get("sources"):
            # no sources list but feedback stored; set empty list for response
            out_sources = []
        else:
            # fallback: convert to empty list
            out_sources = []

        # map items to expected SourceSchema keys (some keys optional)
        # Ensure keys exist (document_id, document_title, page_number, similarity_score, text)
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

        formatted.append(
            {
                "query_id": row.id,
                "query_text": row.query_text,
                "answer": row.response_text or "",
                "sources": normalized_sources,
                "processing_time_ms": row.execution_time or 0,
                "confidence_score": 0.0,
                "created_at": row.created_at,
                # include rating in payload if exists (optional)
                # QueryResponse doesn't have rating by default; if you want it add to schema
            }
        )

    return {"queries": formatted, "total": total}


# -------------------------------
# 3) Get query detail (GET /query/{query_id})
# -------------------------------
@router.get("/{query_id}", response_model=QueryResponse)
def get_query_detail(
    query_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(QueryModel)
        .filter(QueryModel.id == query_id, QueryModel.user_id == current_user.id)
        .first()
    )
    if not query:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Query not found")

    # normalize sources (same logic as history)
    sources = query.sources or []
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
    Feedback is stored safely inside QueryModel.sources (JSON).
    - Prevent multiple feedback submissions
    - Normalize JSON structure
    """
    query = db.query(QueryModel).filter(QueryModel.id == feedback.query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")

# 2. Kiểm tra quyền sở hữu (403)
    if query.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: not your query")

    # ---- Prevent double feedback ----
    existing = query.sources
    if isinstance(existing, dict) and existing.get("feedback"):
        raise HTTPException(status_code=400, detail="Already submitted feedback")

    # ---- Validate rating server-side ----
    if not (1 <= feedback.rating <= 5):
        raise HTTPException(status_code=422, detail="Rating must be from 1 to 5")

    fb_payload = {
        "rating": int(feedback.rating),
        "text": feedback.feedback_text.strip() if feedback.feedback_text else None,
        "created_at": datetime.utcnow().isoformat(),
        "user_id": current_user.id,
    }

    current_sources = query.sources

    # ---- Normalize sources ----
    if not current_sources:
        new_sources = {"sources": [], "feedback": fb_payload}

    elif isinstance(current_sources, list):
        new_sources = {"sources": current_sources, "feedback": fb_payload}

    elif isinstance(current_sources, dict):
        new_sources = {
            "sources": current_sources.get("sources", []),
            "feedback": fb_payload
        }
    else:
        new_sources = {"sources": [], "feedback": fb_payload}

    # ---- Save ----
    query.sources = new_sources

    # Optional: write rating if column exists
    if hasattr(query, "rating"):
        try:
            query.rating = feedback.rating
        except:
            pass

    db.commit()
    db.refresh(query)

    return {
        "query_id": query.id,
        "feedback": fb_payload
    }

@router.get("/{query_id}/feedback")
def get_feedback(
    query_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Query có tồn tại?
    query = db.query(QueryModel).filter(QueryModel.id == query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")

    # 2. Có phải của user không?
    if query.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: not your query")

    sources = query.sources

    # 3. Nếu không có feedback → trả null
    if not sources or not isinstance(sources, dict) or "feedback" not in sources:
        return None

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


# -------------------------------
# 6) Statistics (GET /query/stats)
# -------------------------------
@router.get("/stats")
def get_query_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return:
      - total_queries
      - avg_rating (try numeric column first, fallback to sources.feedback)
      - activity_last_7_days (list of {date, count})
    """
    # total
    total_q = db.query(func.count(QueryModel.id)).filter(QueryModel.user_id == current_user.id).scalar() or 0

    # try numeric avg rating from column (fast), else fallback to scanning sources JSON
    avg_rating = 0.0
    try:
        avg = db.query(func.avg(QueryModel.rating)).filter(
            QueryModel.user_id == current_user.id,
            QueryModel.rating.isnot(None),
        ).scalar()
        avg_rating = round(float(avg), 2) if avg is not None else 0.0
    except Exception:
        # fallback: scan JSON
        records = (
            db.query(QueryModel)
            .filter(QueryModel.user_id == current_user.id)
            .filter(QueryModel.sources.isnot(None))
            .all()
        )
        ratings = []
        for r in records:
            src = r.sources
            if isinstance(src, dict):
                fb = src.get("feedback")
                if isinstance(fb, dict) and "rating" in fb:
                    try:
                        ratings.append(int(fb["rating"]))
                    except Exception:
                        pass
        avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else 0.0

    # daily counts last 7 days (UTC)
    now = datetime.utcnow()
    start_dt = datetime.combine((now.date() - timedelta(days=6)), time.min)

    try:
        daily_counts = (
            db.query(cast(QueryModel.created_at, Date).label("d"), func.count(QueryModel.id).label("cnt"))
            .filter(QueryModel.user_id == current_user.id)
            .filter(QueryModel.created_at >= start_dt)
            .group_by(cast(QueryModel.created_at, Date))
            .order_by(cast(QueryModel.created_at, Date))
            .all()
        )
        daily_map = {row.d: int(row.cnt) for row in daily_counts}
    except Exception:
        # DB might not support cast(...) - fallback to zeroes
        daily_map = {}

    activity = []
    for i in range(7):
        t = (now.date() - timedelta(days=6 - i))
        activity.append({"date": t.isoformat(), "count": int(daily_map.get(t, 0))})

    return {"total_queries": int(total_q), "avg_rating": float(avg_rating), "activity_last_7_days": activity}
