from fastapi import APIRouter, Depends, HTTPException, status, Query as QueryParam
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from datetime import datetime
from typing import Optional, List

from ..schemas.conversation import ConversationUpdate  # <-- Dùng schema chuẩn
from ..database import get_db
from ..models.user import User
from ..models.conversation import Conversation
from ..models.document import Query as QueryModel, Document
from ..utils.security import get_current_user
from pydantic import BaseModel


router = APIRouter(prefix="/conversations", tags=["Conversations"])

# ============================================================
# INLINE SCHEMAS (chỉ giữ ConversationCreate)
# ============================================================
class ConversationCreate(BaseModel):
    title: str
    document_ids: Optional[List[int]] = None
    is_pinned: Optional[bool] = False  # <-- Hỗ trợ pin ngay khi tạo


# ============================================================
# 1) CREATE CONVERSATION
# ============================================================
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_conversation(
    data: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation = Conversation(
        user_id=current_user.id,
        title=data.title,
        is_pinned=data.is_pinned or False,  # <-- NEW
    )

    db.add(conversation)
    db.flush()

    # Gắn document vào conversation nếu có
    if data.document_ids:
        docs = db.query(Document).filter(
            Document.id.in_(data.document_ids),
            Document.user_id == current_user.id
        ).all()
        conversation.documents = docs

    db.commit()
    db.refresh(conversation)

    return {
        "id": conversation.id,
        "title": conversation.title,
        "is_pinned": conversation.is_pinned,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "queries": [],
        "document_ids": [d.id for d in conversation.documents],
    }


# ============================================================
# 2) GET ALL CONVERSATIONS
# ============================================================
@router.get("/")
def get_conversations(
    skip: int = QueryParam(0, ge=0),
    limit: int = QueryParam(100, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversations = (
        db.query(Conversation, func.count(QueryModel.id).label("query_count"))
        .outerjoin(QueryModel, Conversation.id == QueryModel.conversation_id)
        .filter(Conversation.user_id == current_user.id)
        .group_by(Conversation.id)
        .order_by(
            Conversation.is_pinned.desc(),      # <-- NEW: pinned lên đầu
            Conversation.updated_at.desc()
        )
        .offset(skip)
        .limit(limit)
        .all()
    )

    total = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).count()

    result = []
    for conv, query_count in conversations:
        result.append({
            "id": conv.id,
            "title": conv.title,
            "is_pinned": conv.is_pinned,               # <-- NEW
            "created_at": conv.created_at,
            "updated_at": conv.updated_at,
            "query_count": query_count or 0,
            "document_count": len(conv.documents),
            "documents": [{"id": d.id, "title": d.title} for d in conv.documents]
        })

    return {"conversations": result, "total": total, "skip": skip, "limit": limit}


# ============================================================
# 3) GET CONVERSATION DETAIL
# ============================================================
@router.get("/{conversation_id}")
def get_conversation_detail(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Lấy Queries + Documents
    queries = (
        db.query(QueryModel)
        .options(joinedload(QueryModel.documents))
        .filter(QueryModel.conversation_id == conversation_id)
        .order_by(QueryModel.created_at.asc())
        .all()
    )

    formatted_queries = []
    for q in queries:
        docs_data = [
            {
                "id": d.id,
                "title": d.title,
                "file_path": d.file_path,
                "file_type": d.file_type
            }
            for d in q.documents
        ]

        formatted_queries.append({
            "id": q.id,
            "query_text": q.query_text,
            "response_text": q.response_text or "",
            "sources": q.sources,  # ✅ Bổ sung để hiển thị trích dẫn khi load history
            "created_at": q.created_at,
            "documents": docs_data
        })

    return {
        "id": conversation.id,
        "user_id": conversation.user_id,
        "title": conversation.title,
        "is_pinned": conversation.is_pinned,     # <-- NEW
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "queries": formatted_queries,
        "document_ids": [d.id for d in conversation.documents]
    }


# ============================================================
# 4) UPDATE CONVERSATION
# ============================================================
@router.put("/{conversation_id}")
def update_conversation(
    conversation_id: int,
    data: ConversationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Not found")

    if data.title is not None:
        conversation.title = data.title

    if data.is_pinned is not None:
        conversation.is_pinned = data.is_pinned  # <-- NEW

    conversation.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(conversation)

    return conversation


# ============================================================
# 5) DELETE CONVERSATION
# ============================================================
@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(conversation)
    db.commit()

    return {"message": "Deleted"}
