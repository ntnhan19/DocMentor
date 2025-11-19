from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.user import UserCreate, UserLogin, Token, UserResponse
from ..services.auth_service import AuthService
from ..utils.security import get_current_user
from ..utils.cache import cache

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    result = AuthService.register_user(db, user_data)
    return {
        "access_token": result["access_token"],
        "token_type": result["token_type"]
    }

@router.post("/login") 
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login and get access token"""
    try:
        result = AuthService.authenticate_user(db, credentials.email, credentials.password)
        user_obj = result["user"]

        # Cache lightweight user info for quick access (TTL 5 minutes)
        cache_key = f"user_{user_obj.id}_info"
        user_info = {
            "id": user_obj.id,
            "email": user_obj.email,
            "name": user_obj.full_name or user_obj.email,
            "role": getattr(user_obj.role, "value", str(user_obj.role)),
        }
        cache.set(cache_key, user_info, ttl_seconds=300)

        return {
            "success": True,
            "access_token": result["access_token"],
            "token_type": result["token_type"],
            "user": user_info,
            "token": result["access_token"], 
            "message": "Đăng nhập thành công!"
        }
    except HTTPException:
        raise
    except Exception as e:
        print("Login error:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server")

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user information"""
    # Try return cached user info (faster, avoids extra DB access)
    cache_key = f"user_{current_user.id}_info"
    cached = cache.get(cache_key)
    if cached:
        return cached

    # Fallback: build from DB user object and cache it
    user_info = {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.full_name or current_user.email,
        "role": getattr(current_user.role, "value", str(current_user.role)),
    }
    cache.set(cache_key, user_info, ttl_seconds=300)
    return user_info

@router.get("/test-protected")
async def test_protected_route(current_user = Depends(get_current_user)):
    """Test protected route"""
    return {
        "message": f"Hello {current_user.email}!",
        "user_id": current_user.id,
        "role": current_user.role
    }