from sqlalchemy.orm import Session
import PyPDF2
from docx import Document as DocxDocument
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List, Dict, Any
import logging
from ..models.document import Document
from .embedding_service_local import EmbeddingServiceLocal
# ✅ Setup logging properly
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.embedding_service = EmbeddingServiceLocal()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
    
    async def process_document(self, db: Session, document_id: int, file_path: str):
        """Main processing pipeline for documents"""
        try:
            logger.info(f"🔄 START Processing document {document_id}: {file_path}")
            
            # Get document from DB
            document = db.query(Document).filter(Document.id == document_id).first()
            if not document:
                logger.error(f"❌ Document {document_id} not found in database")
                raise Exception(f"Document {document_id} not found")
            
            logger.info(f"✅ Document found: {document.title}")
            
            # Step 1: Extract text
            logger.info("📄 Step 1: Extracting text...")
            if file_path.endswith('.pdf'):
                text = self.extract_pdf(file_path)
            elif file_path.endswith('.docx'):
                text = self.extract_docx(file_path)
            elif file_path.endswith('.txt'):
                text = self.extract_txt(file_path)
            else:
                raise Exception(f"Unsupported file type: {file_path}")
            
            if not text or len(text.strip()) < 100:
                raise Exception(f"Document is empty or too short: {len(text)} chars")
            
            logger.info(f"✅ Extracted {len(text)} characters")
            
            # Step 2: Split into chunks
            logger.info("✂️ Step 2: Splitting into chunks...")
            text_chunks = self.text_splitter.split_text(text)
            logger.info(f"✅ Created {len(text_chunks)} chunks")
            
            # Step 3: Prepare chunks with metadata
            logger.info("📦 Step 3: Preparing chunks with metadata...")
            chunks_with_metadata = []
            for idx, chunk_text in enumerate(text_chunks):
                chunks_with_metadata.append({
                    'text': chunk_text,
                    'chunk_index': idx,
                    'page_number': 0,
                    'metadata': {
                        'file_type': document.file_type,
                        'title': document.title
                    }
                })
            logger.info(f"✅ Prepared {len(chunks_with_metadata)} chunks")
            
            # Step 4: Create embeddings and store in vector DB
            logger.info("🔮 Step 4: Creating embeddings and storing in vector database...")
            await self.embedding_service.store_chunks(
                document_id=document_id,
                chunks=chunks_with_metadata
            )
            logger.info(f"✅ Embeddings stored in Pinecone")
            
            # Step 5: Update document status
            logger.info("💾 Step 5: Updating document status...")
            existing_metadata = document.metadata_ or {}
            
            new_metadata = {
                **existing_metadata,  # Keep existing data (file_hash, mime_type, etc.)
                'total_chunks': len(text_chunks),
                'total_characters': len(text),
                'processing_status': 'completed'
            }

            # Assign back to document
            document.metadata_ = new_metadata
            document.processed = True
            
            db.commit()
            db.refresh(document)
            
            logger.info(f"✅ Successfully processed document {document_id}")
            logger.info(f"📊 Stats: {len(text_chunks)} chunks, {len(text)} characters")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error processing document {document_id}: {str(e)}")
            logger.exception(e)
            
            try:
                document = db.query(Document).filter(Document.id == document_id).first()
                if document:
                    # ✅ Properly merge metadata
                    existing_metadata = document.metadata_ or {}
                    document.metadata_ = {
                        **existing_metadata,
                        'processing_status': 'failed',
                        'error': str(e)
                    }
                    document.processed = False
                    db.commit()
                    logger.info(f"📝 Updated document status to failed")
            except Exception as db_error:
                logger.error(f"❌ Failed to update document status: {str(db_error)}")
            
            raise
    
    def extract_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        text = ""
        try:
            logger.info(f"📖 Opening PDF: {file_path}")
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                num_pages = len(pdf_reader.pages)
                logger.info(f"📄 PDF has {num_pages} pages")
                
                for page_num in range(num_pages):
                    page = pdf_reader.pages[page_num]
                    page_text = page.extract_text()
                    if page_text:
                        text += f"\n[Page {page_num + 1}]\n{page_text}"
                
            logger.info(f"✅ PDF extraction complete: {len(text)} characters")
            return text.strip()
        except Exception as e:
            logger.error(f"❌ Error extracting PDF: {str(e)}")
            raise
    
    def extract_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            logger.info(f"📖 Opening DOCX: {file_path}")
            doc = DocxDocument(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs if paragraph.text])
            logger.info(f"✅ DOCX extraction complete: {len(text)} characters")
            return text.strip()
        except Exception as e:
            logger.error(f"❌ Error extracting DOCX: {str(e)}")
            raise
    
    def extract_txt(self, file_path: str) -> str:
        """Extract text from TXT file"""
        try:
            logger.info(f"📖 Opening TXT: {file_path}")
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read().strip()
            logger.info(f"✅ TXT extraction complete: {len(text)} characters")
            return text
        except UnicodeDecodeError:
            logger.warning("⚠️ UTF-8 failed, trying latin-1...")
            with open(file_path, 'r', encoding='latin-1') as file:
                text = file.read().strip()
            logger.info(f"✅ TXT extraction complete (latin-1): {len(text)} characters")
            return text
        except Exception as e:
            logger.error(f"❌ Error extracting TXT: {str(e)}")
            raise