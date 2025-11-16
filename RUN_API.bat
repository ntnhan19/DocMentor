@echo off
REM ============================================
REM DocMentor - Quick Start Script
REM ============================================

echo.
echo ╔══════════════════════════════════════════════════╗
echo ║       🚀 DocMentor API - Quick Start             ║
echo ╚══════════════════════════════════════════════════╝
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found! Please install Python 3.10+
    pause
    exit /b 1
)

echo ✅ Python found
echo.

REM Navigate to backend
cd /d "%~dp0backend"
if errorlevel 1 (
    echo ❌ Failed to navigate to backend directory
    pause
    exit /b 1
)

echo 📁 Current directory: %cd%
echo.

REM Check virtual environment
if not exist "venv_support\Scripts\activate.bat" (
    echo ⚠️  Virtual environment not found. Creating...
    python -m venv venv_support
    if errorlevel 1 (
        echo ❌ Failed to create virtual environment
        pause
        exit /b 1
    )
    echo ✅ Virtual environment created
)

echo.
echo 🔧 Activating virtual environment...
call venv_support\Scripts\activate.bat

echo.
echo 📦 Checking requirements...
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Installing requirements (this may take a few minutes)...
    pip install -q -r requirements.txt
    if errorlevel 1 (
        echo ❌ Failed to install requirements
        pause
        exit /b 1
    )
    echo ✅ Requirements installed
) else (
    echo ✅ Requirements already installed
)

echo.
echo 🗄️  Checking database...
python -c "from app.database import engine; from sqlalchemy import text; db = engine.connect(); db.execute(text('SELECT 1')); print('✅ Database connection successful'); db.close()" 2>nul
if errorlevel 1 (
    echo ⚠️  Database might not be accessible
    echo    Make sure PostgreSQL is running and .env is configured
)

echo.
echo ============================================
echo 🚀 Starting DocMentor API...
echo ============================================
echo.
echo API will be available at:
echo   📄 Swagger Docs: http://localhost:8000/docs
echo   📚 ReDoc: http://localhost:8000/redoc
echo   ❤️  Health: http://localhost:8000/health
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
