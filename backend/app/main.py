from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .config import settings
from .routers import auth, documents

app = FastAPI(
    title="DocMentor API",
    description="AI Agent for Document Retrieval and Analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)
app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(query.router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router) 
app.include_router(documents.router)

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
    return {"status": "healthy", "database": "connected"}