# test_gemini_embeddings.py
import asyncio
from app.services.embedding_service_gemini import EmbeddingServiceGemini

async def test():
    service = EmbeddingServiceGemini()
    
    # Test single
    emb = await service.create_embedding("Hello world")
    print(f"✅ Single embedding: {len(emb)} dimensions")
    assert len(emb) == 768, "Wrong dimension!"
    
    # Test batch
    embs = await service.create_embeddings_batch(["Text 1", "Text 2", "Text 3"])
    print(f"✅ Batch embeddings: {len(embs)} items")
    assert len(embs) == 3, "Wrong count!"
    
    # Test query
    query_emb = await service.create_query_embedding("What is AI?")
    print(f"✅ Query embedding: {len(query_emb)} dimensions")
    
    print("\n🎉 All tests passed!")

asyncio.run(test())