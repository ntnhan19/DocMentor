from fastapi import APIRouter, Depends, HTTPException, status, Query as QueryParam
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy import func, cast, Date
from datetime import datetime, timedelta, time
from sqlalchemy import func, desc, asc
from typing import List, Optional

from ..database import get_db
from ..schemas.query import QueryFeedbackCreate, QueryRequest, QueryResponse, QueryHistory, QueryFeedback
from ..services.rag_service_gemini import RAGServiceGemini
from ..utils.security import get_current_user
from ..models.user import User
from ..models.document import Query as QueryModel

router = APIRouter(prefix="/query", tags=["Query & RAG"])

# ==========================================================
# 1️⃣ GỬI QUERY
# ==========================================================
@router.post("/", response_model=QueryResponse)
async def query_documents(
    request: QueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Query tài liệu với AI (Gemini)"""
    rag_service = RAGServiceGemini()

    result = await rag_service.query_documents(
        db=db,
        user=current_user,
        query_text=request.query_text,
        document_ids=request.document_ids,
        max_results=request.max_results
    )

    return {
        **result,
        "query_text": request.query_text,
        "created_at": datetime.utcnow(),
    }

# ==========================================================
# 2️⃣ XEM LỊCH SỬ QUERY (PHÂN TRANG)
# ==========================================================
@router.get("/history", response_model=QueryHistory)
def get_query_history(
    skip: int = QueryParam(0, ge=0),
    limit: int = QueryParam(20, ge=1, le=100),
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = QueryParam("date", regex="^(date|rating|relevance)$"),
    order: Optional[str] = QueryParam("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    ✅ Lấy lịch sử truy vấn có hỗ trợ:
    - Lọc theo ngày
    - Tìm kiếm từ khóa
    - Sắp xếp linh hoạt (date, rating, relevance)
    """

    query = db.query(QueryModel).filter(QueryModel.user_id == current_user.id)

    # --- Lọc theo ngày ---
    try:
        if date_from:
            start_date = datetime.strptime(date_from, "%Y-%m-%d")
            query = query.filter(QueryModel.created_at >= start_date)
        if date_to:
            end_date = datetime.strptime(date_to, "%Y-%m-%d")
            query = query.filter(QueryModel.created_at <= end_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format, use YYYY-MM-DD")

    # --- Tìm kiếm ---
    if search:
        safe_search = search.replace("%", "\\%").replace("_", "\\_").replace("#", "\\#").replace("/", "\\/")
        query = query.filter(QueryModel.query_text.ilike(f"%{safe_search}%", escape="\\"))

    # --- Sắp xếp ---
    sort_column = QueryModel.created_at  # default sort
    if sort_by == "rating":
        sort_column = QueryModel.rating
    elif sort_by == "relevance":
        # Hiện chưa có độ tương đồng thực tế -> tạm dùng created_at
        sort_column = QueryModel.created_at

    if order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))

    # --- Phân trang ---
    total = query.count()
    queries = query.offset(skip).limit(limit).all()

    # --- Định dạng dữ liệu trả về ---
    formatted_queries = []
    for q in queries:
        formatted_queries.append({
            "query_id": q.id,
            "query_text": q.query_text,
            "answer": q.response_text,
            "sources": q.sources or [],
            "processing_time_ms": q.execution_time or 0,
            "confidence_score": 0.0,
            "created_at": q.created_at,
            "rating": q.rating or 0
        })

    return {
        "total": total,
        "count": len(formatted_queries),
        "queries": formatted_queries
    }

# ==========================================================
# 3️⃣ XÓA QUERY
# ==========================================================
@router.delete("/{query_id}", status_code=status.HTTP_200_OK)
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
    
    return {"message": "Query deleted successfully", "deleted_id": query_id}


# ==========================================================
# 4️⃣ GỬI FEEDBACK
# ==========================================================
@router.post("/feedback")
def submit_feedback(
    feedback: QueryFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Gửi đánh giá cho một truy vấn"""
    query = db.query(QueryModel).filter(
        QueryModel.id == feedback.query_id,
        QueryModel.user_id == current_user.id
    ).first()

    if not query:
        raise HTTPException(status_code=404, detail="Query not found")

    query.feedback = {
        "rating": feedback.rating,
        "text": feedback.feedback_text,
        "created_at": datetime.utcnow().isoformat()
    }

    db.commit()
    return {"message": "Feedback submitted successfully"}@router.post("/feedback")
def submit_feedback(
    feedback: QueryFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(QueryModel).filter(
        QueryModel.id == feedback.query_id,
        QueryModel.user_id == current_user.id
    ).first()

    if not query:
        raise HTTPException(status_code=404, detail="Query not found")

    query.feedback = {
        "rating": feedback.rating,
        "text": feedback.feedback_text,
        "created_at": datetime.utcnow().isoformat()
    }

    db.commit()
    return {"message": "Feedback submitted successfully"
}

# ==========================================================
# 5️⃣ THỐNG KÊ QUERY
# ==========================================================
@router.get("/stats")
def get_query_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Thống kê tổng quan lịch sử query"""
    # Tổng số query
    total_queries = db.query(func.count(QueryModel.id)).filter(
        QueryModel.user_id == current_user.id
    ).scalar() or 0

    # --- Lấy rating trung bình ---
    # Nếu bạn có cột QueryModel.rating (int) thì dùng AVG trên cột sẽ nhanh nhất:
    try:
        avg_rating = db.query(func.avg(QueryModel.rating)).filter(
            QueryModel.user_id == current_user.id,
            QueryModel.rating.isnot(None)
        ).scalar()
        avg_rating = round(avg_rating, 2) if avg_rating is not None else 0.0
    except Exception:
        # fallback: lấy từ sources JSON (chậm hơn)
        feedbacks = (
            db.query(QueryModel)
            .filter(QueryModel.user_id == current_user.id)
            .filter(QueryModel.sources.isnot(None))
            .all()
        )

        ratings = []
        for f in feedbacks:
            fb = f.sources.get("feedback") if isinstance(f.sources, dict) else None
            if fb and "rating" in fb:
                try:
                    ratings.append(int(fb["rating"]))
                except Exception:
                    pass

        avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else 0.0

    # --- Đếm theo ngày (7 ngày gần nhất) ---
    now = datetime.utcnow()
    start_dt = datetime.combine((now.date() - timedelta(days=6)), time.min)  # 7 ngày: today và 6 ngày trước

    # Postgres: cast created_at to date then group by
    daily_counts = (
        db.query(
            cast(QueryModel.created_at, Date).label("date"),
            func.count(QueryModel.id).label("count")
        )
        .filter(QueryModel.user_id == current_user.id)
        .filter(QueryModel.created_at >= start_dt)
        .group_by(cast(QueryModel.created_at, Date))
        .order_by(cast(QueryModel.created_at, Date))
        .all()
    )

    # map results into dict date->count
    daily_map = {r.date: r.count for r in daily_counts}

    # build last 7 days list (in order)
    daily_data = []
    for i in range(7):
        d = (now.date() - timedelta(days=6 - i))  # from 6 days ago up to today
        daily_data.append({"date": d.isoformat(), "count": int(daily_map.get(d, 0))})

    return {
        "total_queries": int(total_queries),
        "avg_rating": float(avg_rating),
        "activity_last_7_days": daily_data
    }
