#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run database migrations (nếu dùng Alembic)
# Uncomment dòng này nếu bạn có migrations
# alembic upgrade head

echo "Build completed successfully!"