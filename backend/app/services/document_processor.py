from sqlalchemy.orm import Session
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List, Dict, Any
import fitz  # PyMuPDF
import logging
import httpx  # ✅ Dùng thư viện này thay cho requests
import os
import io
from docx import Document as DocxDocument
from ..models.document import Document
from .embedding_service_gemini import EmbeddingServiceGemini

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.embedding_service = EmbeddingServiceGemini()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
        
    # ✅ FIX: Chuyển sang async để download file không bị block server
    async def _get_file_content(self, file_path: str) -> bytes:
        """Download file content from URL (Async) or read local file"""
        if file_path.startswith("http"):
            logger.info(f"🌐 Downloading file from URL: {file_path}")
            try:
                # Sử dụng httpx client bất đồng bộ
                async with httpx.AsyncClient() as client:
                    response = await client.get(file_path, timeout=30.0)
                    response.raise_for_status()
                    return response.content
            except Exception as e:
                raise Exception(f"Failed to download file from Cloud: {str(e)}")
        else:
            # Fallback cho file local cũ (nếu có)
            if not os.path.exists(file_path):
                raise Exception(f"File not found on server (Local): {file_path}")
            with open(file_path, "rb") as f:
                return f.read()
    
    # Cần thêm async vào hàm process_document vì _get_file_content giờ là async
    async def process_document(self, db: Session, document_id: int, file_path: str):
        try:
            logger.info(f"🔄 START Processing document {document_id}")
            document = db.query(Document).filter(Document.id == document_id).first()
            if not document: 
                raise Exception(f"Document {document_id} not found")

            # Step 1: Extract text
            logger.info("📄 Step 1: Extracting text...")
            
            # Logic xác định extension từ URL hoặc DB
            file_ext = document.file_type.lower()
            if not file_ext and "." in file_path:
                clean_path = file_path.split("?")[0]
                file_ext = clean_path.split(".")[-1].lower()

            # ✅ AWAIT hàm lấy nội dung file
            file_bytes = await self._get_file_content(file_path)
            logger.info(f"📥 Successfully downloaded {len(file_bytes)} bytes")

            if file_ext == 'pdf':
                text = self.extract_pdf(file_bytes)
            elif file_ext == 'docx':
                text = self.extract_docx(file_bytes)
            elif file_ext == 'txt':
                text = self.extract_txt(file_bytes)
            else:
                # Thử fallback sang PDF nếu không xác định được
                try:
                    text = self.extract_pdf(file_bytes)
                except:
                    raise Exception(f"Unsupported file type: {file_ext}")
            
            logger.info(f"✅ Extracted {len(text)} characters")
            if not text or len(text.strip()) < 10:
                raise Exception("Document text content is too empty to process.")
            
            # Step 2: Split into chunks
            logger.info("✂️ Step 2: Splitting into chunks...")
            text_chunks = self.text_splitter.split_text(text)
            
            # Step 3: Prepare metadata
            chunks_with_metadata = []
            for idx, chunk_text in enumerate(text_chunks):
                chunks_with_metadata.append({
                    'text': chunk_text,
                    'chunk_index': idx,
                    'page_number': self._extract_page_number_from_text(chunk_text),
                    'metadata': {
                        'file_type': document.file_type,
                        'title': document.title
                    }
                })
            
            # Step 4: Embed & Store
            logger.info("🔮 Step 4: Creating embeddings...")
            await self.embedding_service.store_chunks(
                document_id=document_id,
                chunks=chunks_with_metadata
            )
            
            # Step 5: Update DB (Re-fetch to avoid stale session)
            logger.info("💾 Step 5: Updating database...")
            
            # Khởi tạo session ngắn để commit
            document = db.query(Document).filter(Document.id == document_id).first()
            if document:
                existing_metadata = document.metadata_ or {}
                document.metadata_ = {
                    **existing_metadata,
                    'total_chunks': len(text_chunks),
                    'total_characters': len(text),
                    'processing_status': 'completed',
                    'processed_at': str(import_datetime.now())
                }
                document.processed = True
                
                db.add(document)
                db.commit()
                logger.info(f"✅ [DONE] Successfully processed document {document_id}")
            else:
                logger.error(f"❌ Document {document_id} vanished during processing!")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error processing document {document_id}: {str(e)}")
            try:
                # Cập nhật trạng thái thất bại một cách độc lập
                db.rollback()
                document = db.query(Document).filter(Document.id == document_id).first()
                if document:
                    meta = document.metadata_ or {}
                    document.metadata_ = {**meta, 'processing_status': 'failed', 'error': str(e)}
                    db.commit()
            except Exception as inner_e:
                logger.error(f"❌ Failed to even record the failure! {inner_e}")
            raise
    
    # ✅ Các hàm extract giờ nhận bytes trực tiếp, không cần path nữa
    def extract_pdf(self, file_bytes: bytes) -> str:
        text = ""
        try:
            with fitz.open(stream=file_bytes, filetype="pdf") as doc:
                for i, page in enumerate(doc):
                    page_text = page.get_text("text")
                    if page_text:
                        text += f"\n[Page {i + 1}]\n{page_text}"
            return text.strip()
        except Exception as e:
            logger.error(f"❌ Error extracting PDF: {str(e)}")
            raise

    def extract_docx(self, file_bytes: bytes) -> str:
        try:
            file_stream = io.BytesIO(file_bytes)
            doc = DocxDocument(file_stream)
            text = "\n".join([p.text for p in doc.paragraphs if p.text])
            return text.strip()
        except Exception as e:
            logger.error(f"❌ Error extracting DOCX: {str(e)}")
            raise

    def extract_txt(self, file_bytes: bytes) -> str:
        try:
            try:
                return file_bytes.decode('utf-8').strip()
            except:
                return file_bytes.decode('latin-1').strip()
        except Exception as e:
            logger.error(f"❌ Error extracting TXT: {str(e)}")
            raise
        
    def _extract_page_number_from_text(self, chunk_text: str) -> int:
        import re
        match = re.search(r'\[Page (\d+)\]', chunk_text)
        if match: return int(match.group(1))
        return 0
    
from datetime import datetime as import_datetime