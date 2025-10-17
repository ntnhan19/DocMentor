from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.user import UserCreate, UserLogin, Token, UserResponse
from ..services.auth_service import AuthService
from ..utils.security import get_current_user

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
        return {
            "success": True,
            "user": {
                "id": result["user"].id,
                "email": result["user"].email,
                "name": result["user"].full_name or result["user"].email,  # Map full_name → name (fallback email)
                "role": result["user"].role.value,  # Enum → string ("student"|"lecturer"|"admin")
                "avatar": None  
            },
            "token": result["access_token"], 
            "message": "Đăng nhập thành công!"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Lỗi server")

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@router.get("/test-protected")
async def test_protected_route(current_user = Depends(get_current_user)):
    """Test protected route"""
    return {
        "message": f"Hello {current_user.email}!",
        "user_id": current_user.id,
        "role": current_user.role
    }