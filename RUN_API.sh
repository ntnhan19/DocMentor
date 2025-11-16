#!/bin/bash

# ============================================
# DocMentor - Quick Start Script
# ============================================

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║       🚀 DocMentor API - Quick Start             ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found! Please install Python 3.10+"
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""

# Navigate to backend
cd "$(dirname "$0")/backend" || exit 1

echo "📁 Current directory: $(pwd)"
echo ""

# Check virtual environment
if [ ! -d "venv_support" ]; then
    echo "⚠️  Virtual environment not found. Creating..."
    python3 -m venv venv_support
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
    echo "✅ Virtual environment created"
fi

echo ""
echo "🔧 Activating virtual environment..."
source venv_support/bin/activate

echo ""
echo "📦 Checking requirements..."
if ! pip show fastapi > /dev/null 2>&1; then
    echo "⚠️  Installing requirements (this may take a few minutes)..."
    pip install -q -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install requirements"
        exit 1
    fi
    echo "✅ Requirements installed"
else
    echo "✅ Requirements already installed"
fi

echo ""
echo "🗄️  Checking database..."
python3 -c "from app.database import engine; from sqlalchemy import text; db = engine.connect(); db.execute(text('SELECT 1')); print('✅ Database connection successful'); db.close()" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Database might not be accessible"
    echo "   Make sure PostgreSQL is running and .env is configured"
fi

echo ""
echo "============================================"
echo "🚀 Starting DocMentor API..."
echo "============================================"
echo ""
echo "API will be available at:"
echo "   📄 Swagger Docs: http://localhost:8000/docs"
echo "   📚 ReDoc: http://localhost:8000/redoc"
echo "   ❤️  Health: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
