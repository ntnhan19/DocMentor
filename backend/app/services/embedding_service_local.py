from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from typing import List, Dict, Any
from ..config import settings
import logging

logger = logging.getLogger(__name__)

class EmbeddingServiceLocal:
    """
    Local embedding service using Sentence-Transformers (FREE)
    No OpenAI API needed!
    """
    
    def __init__(self):
        # Load model locally (downloads once, then cached)
        logger.info("🔄 Loading sentence-transformers model...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')  # 384 dimensions, fast & good
        logger.info("✅ Model loaded!")
        
        # Initialize Pinecone
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index = self.pc.Index(settings.PINECONE_INDEX_NAME)
    
    async def create_embedding(self, text: str) -> List[float]:
        """Create embedding vector for text using local model"""
        try:
            # Sentence-transformers is synchronous, but fast enough
            embedding = self.model.encode(text, convert_to_tensor=False)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error creating embedding: {str(e)}")
            raise
    
    async def create_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Create embeddings for multiple texts"""
        try:
            logger.info(f"Creating embeddings for {len(texts)} texts...")
            # Batch encoding is much faster
            embeddings = self.model.encode(texts, convert_to_tensor=False, show_progress_bar=True)
            return embeddings.tolist()
        except Exception as e:
            logger.error(f"Error creating batch embeddings: {str(e)}")
            raise
    
    async def store_chunks(
        self, 
        document_id: int, 
        chunks: List[Dict[str, Any]]
    ) -> bool:
        """Store document chunks with embeddings in Pinecone"""
        try:
            texts = [chunk['text'] for chunk in chunks]
            
            logger.info(f"Creating embeddings for {len(texts)} chunks...")
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
            
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i:i + batch_size]
                self.index.upsert(vectors=batch)
            
            logger.info(f"✅ Successfully stored {len(vectors)} chunks for document {document_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error storing chunks: {str(e)}")
            raise
    
    async def search_similar_chunks(
        self, 
        query: str, 
        document_ids: List[int] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """Search for similar chunks"""
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
        """Delete all chunks of a document"""
        try:
            self.index.delete(filter={'document_id': document_id})
            logger.info(f"✅ Deleted chunks for document {document_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting chunks: {str(e)}")
            raise