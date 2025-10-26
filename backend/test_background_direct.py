import asyncio
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.document_processor import DocumentProcessor

async def test_processing():
    """Test document processing directly without FastAPI"""
    
    db = SessionLocal()
    try:
        # Thay đổi document_id và file_path thành giá trị thực tế
        document_id = 11  # ID từ kết quả upload của bạn
        file_path = "uploads/1_20251026_120555_test_document.txt"
        
        print(f"Testing processing for document {document_id}")
        print(f"File path: {file_path}")
        
        processor = DocumentProcessor()
        
        print("\n🚀 Starting processing...")
        await processor.process_document(db, document_id, file_path)
        
        print("\n✅ Processing completed!")
        
        # Check document status
        from app.models.document import Document
        doc = db.query(Document).filter(Document.id == document_id).first()
        print(f"\n📊 Document status:")
        print(f"  Processed: {doc.processed}")
        print(f"  Metadata: {doc.metadata_}")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_processing())