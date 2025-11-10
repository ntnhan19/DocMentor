# app/services/embedding_service.py

# ✅ BƯỚC 1: Import AsyncOpenAI thay vì OpenAI

from pinecone import Pinecone
from typing import List, Dict, Any
from ..config import settings
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        # ✅ BƯỚC 2: Khởi tạo AsyncOpenAI
        self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Initialize Pinecone
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index = self.pc.Index(settings.PINECONE_INDEX_NAME)

    # ✅ BƯỚC 3: Chuyển hàm này thành async và dùng await
    async def create_embedding(self, text: str) -> List[float]:
        """
        Create embedding vector for text using OpenAI
        """
        try:
            response = await self.openai_client.embeddings.create(
                model="text-embedding-ada-002",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error creating embedding: {str(e)}")
            raise

    # ✅ BƯỚC 4: Chuyển hàm này thành async và dùng await
    async def create_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Create embeddings for multiple texts (batch processing)
        """
        try:
            batch_size = 100
            all_embeddings = []
            
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                response = await self.openai_client.embeddings.create(
                    model="text-embedding-ada-002",
                    input=batch
                )
                batch_embeddings = [item.embedding for item in response.data]
                all_embeddings.extend(batch_embeddings)
            
            return all_embeddings
        except Exception as e:
            logger.error(f"Error creating batch embeddings: {str(e)}")
            raise

    async def store_chunks(
        self, 
        document_id: int, 
        chunks: List[Dict[str, Any]]
    ) -> bool:
        """
        Store document chunks with embeddings in Pinecone
        """
        try:
            texts = [chunk['text'] for chunk in chunks]
            
            logger.info(f"Creating embeddings for {len(texts)} chunks...")
            # ✅ BƯỚC 5: Thêm 'await' ở đây vì hàm create_embeddings_batch giờ là async
            embeddings = await self.create_embeddings_batch(texts)
            
            vectors = []
            for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                vector_id = f"doc_{document_id}_chunk_{idx}"
                
                metadata = {
                    'document_id': document_id,
                    'chunk_index': idx,
                    'text': chunk['text'][:1000],
                    'page_number': chunk.get('page_number', 0),
                }
                
                if 'metadata' in chunk:
                    metadata.update(chunk['metadata'])
                
                vectors.append({
                    'id': vector_id,
                    'values': embedding,
                    'metadata': metadata
                })
            
            batch_size = 100
            logger.info(f"Uploading {len(vectors)} vectors to Pinecone...")
            
            # Lưu ý: Pinecone v3+ là đồng bộ, nhưng nó đủ nhanh để chạy trong async context.
            # Nếu nó gây chậm, bạn có thể bọc nó trong asyncio.to_thread
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i:i + batch_size]
                self.index.upsert(vectors=batch)
            
            logger.info(f"✅ Successfully stored {len(vectors)} chunks for document {document_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error storing chunks: {str(e)}")
            raise

    # Các hàm search và delete không cần thay đổi nếu chúng chỉ dùng Pinecone
    # Tuy nhiên, để nhất quán, hàm search cũng nên là async vì nó gọi create_embedding
    async def search_similar_chunks(
        self, 
        query: str, 
        document_ids: List[int] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        try:
            query_embedding = await self.create_embedding(query)
            
            filter_dict = None
            if document_ids:
                filter_dict = {'document_id': {'$in': document_ids}}
            
            results = self.index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True,
                filter=filter_dict
            )
            
            matches = []
            for match in results.matches:
                matches.append({
                    'id': match.id,
                    'score': match.score,
                    'document_id': match.metadata.get('document_id'),
                    'chunk_index': match.metadata.get('chunk_index'),
                    'text': match.metadata.get('text'),
                    'page_number': match.metadata.get('page_number'),
                })
            
            return matches
            
        except Exception as e:
            logger.error(f"Error searching chunks: {str(e)}")
            raise

    def delete_document_chunks(self, document_id: int) -> bool:
        try:
            self.index.delete(filter={'document_id': document_id})
            logger.info(f"✅ Deleted chunks for document {document_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting chunks: {str(e)}")
            raise