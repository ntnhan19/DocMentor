# File: recreate_pinecone_index.py
from pinecone import Pinecone, ServerlessSpec
from app.config import settings

pc = Pinecone(api_key=settings.PINECONE_API_KEY)

index_name = settings.PINECONE_INDEX_NAME

# Delete old index if exists
if index_name in pc.list_indexes().names():
    print(f"🗑️ Deleting old index '{index_name}'...")
    pc.delete_index(index_name)
    print("✅ Deleted")

# Create new index with 384 dimensions
print(f"🔨 Creating new index '{index_name}' with 384 dimensions...")
pc.create_index(
    name=index_name,
    dimension=384,  # ✅ Changed from 1536 to 384
    metric='cosine',
    spec=ServerlessSpec(
        cloud='aws',
        region='us-east-1'
    )
)

print("✅ Index created successfully!")
print(f"📊 Stats: {pc.Index(index_name).describe_index_stats()}")