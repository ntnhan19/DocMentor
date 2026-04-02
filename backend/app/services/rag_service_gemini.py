from sqlalchemy.orm import Session
from typing import List, Dict, Any, Tuple, Optional
import time
import logging
import re
from ..config import settings
from ..models.document import Document, Query as QueryModel
from ..models.user import User
from .embedding_service_gemini import EmbeddingServiceGemini
from .gemini_service import GeminiService
from ..utils.text_normalizer import normalize_text
from ..utils.prompts import (
    SYSTEM_INSTRUCTION,
    RAG_QUERY_TEMPLATE,
    format_context,
    NO_RESULT_RESPONSE
)
from fastapi import BackgroundTasks

logger = logging.getLogger(__name__)

class RAGServiceGemini:
    """RAG Service using optimized prompts with source extraction"""

    def __init__(self):
        self.embedding_service = EmbeddingServiceGemini()
        self.gemini_service = GeminiService()

    # ============================================================================
    # 1. EXTRACT SOURCES (Helper Function)
    # ============================================================================
    def extract_sources_from_response(
        self,
        answer_text: str,
        retrieved_chunks: List[Dict],
        doc_map: Dict[int, Document]
    ) -> Tuple[str, List[Dict]]:
        """
        Trích xuất trích dẫn, đánh số lại (normalization) để đảm bảo index khớp với mảng sources.
        """
        if not answer_text:
            return answer_text, []

        # 1. Xây dựng bản đồ gốc: Index (1, 2, 3...) -> Dữ liệu nguồn
        full_citation_map = {}
        for idx, chunk in enumerate(retrieved_chunks, 1):
            doc = doc_map.get(int(chunk.get('document_id')))
            full_citation_map[idx] = {
                'document_id': str(chunk.get('document_id')),
                'document_title': doc.title if doc else (chunk.get('metadata', {}).get('title', 'Tài liệu')),
                'page_number': chunk.get('page_number') or chunk.get('metadata', {}).get('page'),
                'similarity_score': round(chunk.get('score', 0.0), 3),
                'text': chunk.get('text', '')[:500] # ✅ Snippet cho tooltip
            }
        
        # 2. Tìm các chỉ số AI thực sự sử dụng
        citation_pattern = r'\[(\d+(?:,\s*\d+)*)\]'
        found_matches = re.finditer(citation_pattern, answer_text)
        
        used_old_indices = []
        for match in found_matches:
            nums = [int(n.strip()) for n in match.group(1).split(',') if n.strip().isdigit()]
            for n in nums:
                if n in full_citation_map and n not in used_old_indices:
                    used_old_indices.append(n)
        
        # 3. Fallback nếu AI quên trích dẫn nhưng có kết quả trả về
        if not used_old_indices and retrieved_chunks:
            used_old_indices = [1, 2, 3][:len(retrieved_chunks)]
            
        # 4. Tạo bản đồ ánh xạ Mới -> Cũ và danh sách nguồn cuối cùng
        # VD: used_old_indices = [3, 5] -> mapping = {3: 1, 5: 2}
        new_mapping = {old: i + 1 for i, old in enumerate(used_old_indices)}
        final_sources = [full_citation_map[old] for old in used_old_indices if old in full_citation_map]

        # 5. Thay thế các con số trong văn bản bằng chỉ số mới đã chuẩn hóa
        def replace_match(match):
            nums = [int(n.strip()) for n in match.group(1).split(',') if n.strip().isdigit()]
            new_nums = [new_mapping[n] for n in nums if n in new_mapping]
            if not new_nums: return match.group(0)
            return f"[{', '.join(map(str, sorted(list(set(new_nums)))))}]"

        normalized_text = re.sub(citation_pattern, replace_match, answer_text)

        # 6. Dọn dẹp văn bản (xóa các rác AI tự thêm)
        cleaned_text = re.sub(r'\[(?:Nguồn|Source)\s*\d+:\s*[^\]]+\]', '', normalized_text).strip()
        cleaned_text = re.sub(r'(?i)\n+━+\s*📚?\s*NGUỒN THAM KHẢO.*$', '', cleaned_text, flags=re.DOTALL).strip()

        return cleaned_text, final_sources

    # ============================================================================
    # 2. MAIN QUERY FUNCTION
    # ============================================================================
    async def query_documents_stream(
        self,
        db: Session,
        user: User,
        query_text: str,
        document_ids: List[int],
        max_results: int = 10,
        conversation_id: Optional[int] = None,
        background_tasks: Optional[BackgroundTasks] = None
    ):
        """
        Streaming RAG pipeline.
        Yields JSON chunks for SSE.
        """
        import json
        start_time = time.time()
        accumulated_answer = ""
        
        try:
            # --- Bước 1: Kiểm tra tài liệu & Self-Healing ---
            all_selected_docs = db.query(Document).filter(
                Document.id.in_(document_ids),
                Document.user_id == user.id
            ).all()

            if not all_selected_docs:
                yield json.dumps({"answer": "Không tìm thấy tài liệu phù hợp.", "is_done": True})
                return

            # Trigger background processing
            unprocessed_docs = [d for d in all_selected_docs if not d.processed]
            if unprocessed_docs and background_tasks:
                from ..routers.documents import process_document_background
                for doc in unprocessed_docs:
                    background_tasks.add_task(process_document_background, doc.id, doc.file_path)

            processed_docs = [d for d in all_selected_docs if d.processed]
            if not processed_docs:
                yield json.dumps({"is_processing": True, "answer": "Tài liệu đang được nạp vào bộ nhớ...", "is_done": True})
                return

            valid_doc_ids = [doc.id for doc in processed_docs]
            doc_map = {doc.id: doc for doc in processed_docs}

            # --- Bước 2: Tìm kiếm ngữ cảnh ---
            matches = await self.embedding_service.search_similar_chunks(
                query=query_text,
                document_ids=valid_doc_ids,
                top_k=max_results
            )

            if not matches or matches[0]['score'] < 0.25:
                yield json.dumps({"answer": NO_RESULT_RESPONSE.format(query=query_text), "is_done": True})
                return

            context = format_context(matches, doc_map)

            # --- Bước 3: Streaming từ Gemini ---
            async for text_chunk in self.gemini_service.generate_answer_stream(
                query=query_text,
                context=context,
                system_instruction=SYSTEM_INSTRUCTION
            ):
                accumulated_answer += text_chunk
                yield json.dumps({"chunk": text_chunk})

            # --- Bước 4: Xử lý hậu kỳ (Trích dẫn & Lưu DB) ---
            cleaned_answer, sources = self.extract_sources_from_response(
                accumulated_answer,
                matches,
                doc_map
            )

            # Lưu lịch sử vào Database
            query_record = QueryModel(
                user_id=user.id,
                conversation_id=conversation_id,
                query_text=query_text,
                response_text=cleaned_answer,
                sources=sources,
                execution_time=int((time.time() - start_time) * 1000)
            )
            query_record.documents = processed_docs
            db.add(query_record)
            db.commit()
            db.refresh(query_record)

            # Gửi chunk cuối cùng chứa metadata đầy đủ
            yield json.dumps({
                "query_id": query_record.id,
                "answer": cleaned_answer, # Gửi bản đã sạch trích dẫn
                "sources": sources,
                "is_done": True
            })

        except Exception as e:
            logger.error(f"❌ Error in streaming RAG: {str(e)}")
            yield json.dumps({"error": str(e), "is_done": True})

    # ==============================================================
    # 🔧 Private helper methods
    # ==============================================================

    def _format_sources(self, matches: List[Dict], doc_map: Dict[int, Document]) -> List[Dict]:
        """
        Format metadata for sources (legacy format - use extract_sources_from_response instead)
        """
        sources = []

        for match in matches:
            doc_id = match['document_id']
            doc = doc_map.get(doc_id)

            sources.append({
                'document_id': str(doc_id),
                'document_title': doc.title if doc else "Unknown Document",
                'page_number': match.get('page_number'),
                'similarity_score': round(match['score'], 3),
                'text': match['text'][:300] + "..." if len(match['text']) > 300 else match['text']
            })

        return sources

    def get_user_query_history(
        self,
        db: Session,
        user: User,
        skip: int = 0,
        limit: int = 50
    ) -> List[QueryModel]:
        """Get user's query history"""
        return (
            db.query(QueryModel)
            .filter(QueryModel.user_id == user.id)
            .order_by(QueryModel.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )