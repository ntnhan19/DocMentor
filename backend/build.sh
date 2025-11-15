#!/usr/bin/env bash
set -o errexit

echo "🔄 Starting build process..."

echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "📁 Creating uploads directory..."
mkdir -p uploads

echo "🗄️ Running database migrations..."
alembic upgrade head

echo "✅ Build completed successfully!"