# app/services/embedding_service_gemini.py

import google.generativeai as genai
from pinecone import Pinecone
from typing import List, Dict, Any
from ..config import settings
import logging

logger = logging.getLogger(__name__)

class EmbeddingServiceGemini:
    """
    Gemini embedding service - COMPLETELY FREE!
    Uses Google's text-embedding-004 model
    """
    
    def __init__(self):
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        logger.info("✅ Gemini embeddings configured!")
        
        # Initialize Pinecone
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index = self.pc.Index(settings.PINECONE_INDEX_NAME)
    
    async def create_embedding(self, text: str) -> List[float]:
        """
        Create embedding vector using Gemini
        Model: text-embedding-004 (768 dimensions)
        """
        try:
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text,
                task_type="retrieval_document"  # For storing in vector DB
            )
            return result['embedding']
        except Exception as e:
            logger.error(f"Error creating Gemini embedding: {str(e)}")
            raise
    
    async def create_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Create embeddings for multiple texts
        Gemini supports batch processing efficiently
        """
        try:
            logger.info(f"Creating Gemini embeddings for {len(texts)} texts...")
            
            # Gemini can handle batches, but we'll process in chunks for safety
            batch_size = 100
            all_embeddings = []
            
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                
                # Gemini batch embedding
                results = genai.embed_content(
                    model="models/text-embedding-004",
                    content=batch,
                    task_type="retrieval_document"
                )
                
                # Extract embeddings
                if isinstance(results['embedding'][0], list):
                    # Multiple texts
                    all_embeddings.extend(results['embedding'])
                else:
                    # Single text
                    all_embeddings.append(results['embedding'])
            
            logger.info(f"✅ Created {len(all_embeddings)} embeddings")
            return all_embeddings
            
        except Exception as e:
            logger.error(f"Error creating batch Gemini embeddings: {str(e)}")
            raise
    
    async def create_query_embedding(self, query: str) -> List[float]:
        """
        Create embedding for search query
        Uses task_type="retrieval_query" for better search results
        """
        try:
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=query,
                task_type="retrieval_query"  # Optimized for queries
            )
            return result['embedding']
        except Exception as e:
            logger.error(f"Error creating query embedding: {str(e)}")
            raise
    
    async def store_chunks(
        self, 
        document_id: int, 
        chunks: List[Dict[str, Any]]
    ) -> bool:
        """
        Store document chunks with Gemini embeddings in Pinecone
        """
        try:
            texts = [chunk['text'] for chunk in chunks]
            
            logger.info(f"Creating Gemini embeddings for {len(texts)} chunks...")
            embeddings = await self.create_embeddings_batch(texts)
            
            vectors = []
            for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                vector_id = f"doc_{document_id}_chunk_{idx}"
                
                metadata = {
                    'document_id': document_id,
                    'chunk_index': idx,
                    'text': chunk['text'][:1000],  # Pinecone metadata limit
                    'page_number': chunk.get('page_number', 0),
                }
                
                if 'metadata' in chunk:
                    metadata.update(chunk['metadata'])
                
                vectors.append({
                    'id': vector_id,
                    'values': embedding,
                    'metadata': metadata
                })
            
            # Upload to Pinecone in batches
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
        """
        Search for similar chunks using Gemini query embedding
        """
        try:
            # Use query-optimized embedding
            query_embedding = await self.create_query_embedding(query)
            
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
        """
        Delete all chunks of a document from Pinecone
        """
        try:
            self.index.delete(filter={'document_id': document_id})
            logger.info(f"✅ Deleted chunks for document {document_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting chunks: {str(e)}")
            raise