from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .config import settings
from .routers import auth, documents, query, analysis, analytics
import os

app = FastAPI(
    title="DocMentor API",
    description="AI Agent for Document Retrieval and Analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ===================================
# CORS FIX - Quan trọng!
# ===================================
# KHÔNG cho phép "*" khi dùng allow_credentials=True
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://docmentor-api.onrender.com",  # URL Render của bạn
]

# Thêm FRONTEND_URL từ env nếu có
if os.getenv("FRONTEND_URL"):
    frontend_url = os.getenv("FRONTEND_URL")
    if frontend_url not in allowed_origins:
        allowed_origins.append(frontend_url)

# Trong development, cho phép tất cả origins (tắt credentials)
if settings.ENVIRONMENT == "development":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Development: cho phép tất cả
        allow_credentials=False,  # Phải tắt credentials khi dùng "*"
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Production: chỉ cho phép origins cụ thể
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers
app.include_router(auth.router) 
app.include_router(documents.router)
app.include_router(query.router)
app.include_router(analysis.router)
app.include_router(analytics.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to DocMentor API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
            "features": {
            "auth": "/auth",
            "documents": "/documents",
            "query": "/query (RAG with Gemini)",
            "analysis": "/analysis (Summary, Concepts, Quiz)",
            "analytics": "/analytics (popular, ... )"
        }
    }

@app.get("/health")
def health_check():
    """Health check endpoint - không cần DB connection"""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "ai": "Gemini 2.5 Flash"
    }

# ===================================
# Startup event - Test DB connection
# ===================================
@app.on_event("startup")
async def startup_event():
    """Test database connection on startup"""
    try:
        # Test database connection
        from sqlalchemy import text
        from .database import SessionLocal
        
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        print("✅ Database connected successfully")
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        # Không raise exception để server vẫn chạy được
        # raise e
