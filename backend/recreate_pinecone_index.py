# File: recreate_pinecone_index.py
from pinecone import Pinecone, ServerlessSpec
from app.config import settings
import time

pc = Pinecone(api_key=settings.PINECONE_API_KEY)

index_name = settings.PINECONE_INDEX_NAME

# Delete old index if exists
if index_name in pc.list_indexes().names():
    print(f"🗑️ Deleting old index '{index_name}'...")
    pc.delete_index(index_name)
    print("⏳ Waiting for deletion to complete...")
    time.sleep(5)
    print("✅ Deleted")

# Create new index with 384 dimensions (all-MiniLM-L6-v2 model)
print(f"🔨 Creating new index '{index_name}' with 384 dimensions...")
pc.create_index(
    name=index_name,
    dimension=384,  # 🎯 IMPORTANT: Match với sentence-transformers model
    metric='cosine',
    spec=ServerlessSpec(
        cloud='aws',
        region='us-east-1'
    )
)

print("⏳ Waiting for index to be ready...")
time.sleep(10)

print("✅ Index created successfully!")
index = pc.Index(index_name)
print(f"📊 Stats: {index.describe_index_stats()}")