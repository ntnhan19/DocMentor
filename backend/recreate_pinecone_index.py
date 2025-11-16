# recreate_pinecone_index.py
from pinecone import Pinecone, ServerlessSpec
from app.config import settings

pc = Pinecone(api_key=settings.PINECONE_API_KEY)

# Delete old index if exists
try:
    pc.delete_index("docmentor")
    print("🗑️ Deleted old index")
except:
    print("⚠️ No existing index to delete")

# Create new index with 768 dimensions (Gemini embedding size)
print("🔨 Creating new Pinecone index with 768 dimensions...")
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
print(f"📊 Stats: {pc.Index('docmentor').describe_index_stats()}")
