from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict

from ..database import get_db
from ..utils.security import get_current_user
from ..models.user import User
from ..models.document import Query as QueryModel
from ..utils.cache import cache

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/popular")
def get_popular_queries(
	limit: int = 10,
	db: Session = Depends(get_db),
	current_user: User = Depends(get_current_user),
):
	"""Return popular queries for current user (cached 10 minutes)."""
	cache_key = f"user_{current_user.id}_popular_queries"
	cached = cache.get(cache_key)
	if cached:
		return cached

	# Group by query_text and count occurrences
	try:
		rows = (
			db.query(QueryModel.query_text, func.count(QueryModel.id).label("cnt"))
			.filter(QueryModel.user_id == current_user.id)
			.group_by(QueryModel.query_text)
			.order_by(desc("cnt"))
			.limit(limit)
			.all()
		)

		result: List[Dict[str, int]] = [
			{"query_text": r.query_text, "count": int(r.cnt)} for r in rows if r.query_text
		]
	except Exception:
		result = []

	# Cache for 10 minutes
	try:
		cache.set(cache_key, result, ttl_seconds=600)
	except Exception:
		pass

	return result

