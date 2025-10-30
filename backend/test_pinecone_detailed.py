from pinecone import Pinecone
from app.config import settings

try:
    print("Testing Pinecone...")
    print(f"API Key: {settings.PINECONE_API_KEY[:10]}...")
    print(f"Index Name: {settings.PINECONE_INDEX_NAME}")
    
    pc = Pinecone(api_key=settings.PINECONE_API_KEY)
    
    # List indexes
    indexes = pc.list_indexes()
    print(f"Available indexes: {indexes.names()}")
    
    # Check if our index exists
    if settings.PINECONE_INDEX_NAME in indexes.names():
        print(f"✅ Index '{settings.PINECONE_INDEX_NAME}' exists")
        
        # Get index
        index = pc.Index(settings.PINECONE_INDEX_NAME)
        stats = index.describe_index_stats()
        
        print(f"📊 Index stats:")
        print(f"  Total vectors: {stats.total_vector_count}")
        print(f"  Dimension: {stats.dimension}")
        
        # Try to upsert a test vector
        print("\nTesting upsert...")
        test_vector = {
            'id': 'test_vector_1',
            'values': [0.1] * 1536,  # OpenAI embedding dimension
            'metadata': {'test': 'true'}
        }
        
        index.upsert(vectors=[test_vector])
        print("✅ Test vector upserted successfully")
        
        # Query to verify
        import time
        time.sleep(2)  # Wait for indexing
        
        results = index.query(
            vector=[0.1] * 1536,
            top_k=1,
            include_metadata=True
        )
        
        if results.matches:
            print(f"✅ Query successful: Found {len(results.matches)} matches")
        
        # Clean up test vector
        index.delete(ids=['test_vector_1'])
        print("🧹 Test vector deleted")
        
    else:
        print(f"❌ Index '{settings.PINECONE_INDEX_NAME}' NOT FOUND")
        print("Create it at: https://app.pinecone.io/")
        
except Exception as e:
    print(f"❌ Pinecone Error: {str(e)}")
    import traceback
    traceback.print_exc()