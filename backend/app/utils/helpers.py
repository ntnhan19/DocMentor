import os
import hashlib
from datetime import datetime
from typing import List
from fastapi import UploadFile, HTTPException, status
from ..config import settings

def validate_file_type(filename: str) -> str:
    """Validate file type and return extension"""
    allowed_extensions = settings.ALLOWED_EXTENSIONS.split(',')
    file_ext = os.path.splitext(filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_ext} not supported. Allowed: {', '.join(allowed_extensions)}"
        )
    
    return file_ext

def validate_file_size(file_size: int) -> bool:
    """Validate file size"""
    if file_size > settings.MAX_FILE_SIZE:
        max_size_mb = settings.MAX_FILE_SIZE / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {max_size_mb}MB"
        )
    return True

def generate_unique_filename(user_id: int, original_filename: str) -> str:
    """Generate unique filename to prevent collisions"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    name, ext = os.path.splitext(original_filename)
    
    # Sanitize filename
    safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '_', '-'))
    safe_name = safe_name.replace(' ', '_')[:50]  # Limit length
    
    return f"{user_id}_{timestamp}_{safe_name}{ext}"

def calculate_file_hash(file_path: str) -> str:
    """Calculate SHA256 hash of file"""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def ensure_upload_dir() -> str:
    """Ensure upload directory exists"""
    upload_dir = settings.UPLOAD_DIR
    os.makedirs(upload_dir, exist_ok=True)
    return upload_dir

def format_file_size(size_bytes: int) -> str:
    """Format file size to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"