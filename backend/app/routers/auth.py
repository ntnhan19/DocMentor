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

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login and get access token"""
    result = AuthService.authenticate_user(db, credentials.email, credentials.password)
    return {
        "access_token": result["access_token"],
        "token_type": result["token_type"]
    }

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