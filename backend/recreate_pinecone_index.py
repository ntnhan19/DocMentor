# create_pinecone_index.py
from pinecone import Pinecone, ServerlessSpec
from app.config import settings

pc = Pinecone(api_key=settings.PINECONE_API_KEY)

# Xóa index cũ (nếu có)
try:
    pc.delete_index("docmentor")
    print("🗑️ Deleted old index")
except:
    print("⚠️ No existing index to delete")

# Tạo index mới với dimension 768
pc.create_index(
    name="docmentor",
    dimension=768,  # ✅ Gemini embedding size
    metric="cosine",
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    )
)

print("✅ Created new Pinecone index with 768 dimensions")