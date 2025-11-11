from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .config import settings
from .routers import auth, documents, query
import os

app = FastAPI(
    title="DocMentor API",
    description="AI Agent for Document Retrieval and Analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - Thêm domain production
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

# Nếu có FRONTEND_URL từ environment variables (khi deploy)
if os.getenv("FRONTEND_URL"):
    allowed_origins.append(os.getenv("FRONTEND_URL"))

# Cho phép tất cả origins khi test (có thể tắt sau)
allowed_origins.append("*")

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

@app.get("/")
def read_root():
    return {
        "message": "Welcome to DocMentor API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected", "python_version": os.sys.version}