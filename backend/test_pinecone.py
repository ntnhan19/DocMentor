from pinecone import Pinecone, ServerlessSpec
from app.config import settings

# Initialize Pinecone
pc = Pinecone(api_key=settings.PINECONE_API_KEY)

# Check if index exists
index_name = settings.PINECONE_INDEX_NAME

if index_name not in pc.list_indexes().names():
    # Create index
    pc.create_index(
        name=index_name,
        dimension=1536,  # OpenAI embedding dimension
        metric='cosine',
        spec=ServerlessSpec(
            cloud='aws',
            region='us-east-1'
        )
    )
    print(f"✅ Created index: {index_name}")
else:
    print(f"✅ Index already exists: {index_name}")

# Get index
index = pc.Index(index_name)
print(f"✅ Connected to index: {index.describe_index_stats()}")