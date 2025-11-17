#!/usr/bin/env bash
set -o errexit

echo "🔄 Starting build process..."

echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "📁 Creating uploads directory..."
mkdir -p uploads

echo "🗑️ Resetting database..."
python reset_db.py

echo "🗄️ Running database migrations..."
cd backend
alembic upgrade head
cd ..

echo "✅ Build completed successfully!"