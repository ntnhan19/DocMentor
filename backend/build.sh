#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "🔄 Starting build process..."

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Comment out pre-download - model sẽ download lần đầu khi API start
# echo "📦 Downloading sentence-transformers model..."
# python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

echo "📁 Creating uploads directory..."
mkdir -p uploads

# Run database migrations (uncomment if using Alembic)
# echo "🔄 Running database migrations..."
# alembic upgrade head

echo "✅ Build completed successfully!"