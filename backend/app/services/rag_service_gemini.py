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
    async def query_documents(
        self,
        db: Session,
        user: User,
        query_text: str,
        document_ids: List[int],
        max_results: int = 10,
        conversation_id: Optional[int] = None,
        background_tasks: Optional[BackgroundTasks] = None # ✅ Nhận background_tasks
    ) -> Dict[str, Any]:
        """Main RAG pipeline with source extraction"""
        start_time = time.time()

        try:
            logger.info(f"🔍 Processing query from user {user.id}: '{query_text}'")

            # --- Step 1: Validate Documents & Trigger Self-Healing ---
            # Tìm tất cả tài liệu user chọn (không quan tâm processed hay chưa)
            all_selected_docs = db.query(Document).filter(
                Document.id.in_(document_ids),
                Document.user_id == user.id
            ).all()

            if not all_selected_docs:
                return {
                    'query_id': None,
                    'answer': "Không tìm thấy tài liệu phù hợp.",
                    'is_processing': False,
                    'sources': [],
                    'confidence_score': 0.0,
                    'processing_time_ms': int((time.time() - start_time) * 1000)
                }

            # Tự động kích hoạt xử lý cho tài liệu chưa xong
            unprocessed_docs = [d for d in all_selected_docs if not d.processed]
            if unprocessed_docs and background_tasks:
                from ..routers.documents import process_document_background
                for doc in unprocessed_docs:
                    logger.info(f"⚡ [SELF-HEALING] Triggering background processing for doc {doc.id}")
                    background_tasks.add_task(process_document_background, doc.id, doc.file_path)

            # Chỉ lấy những tài liệu đã processed để thực hiện RAG
            documents = [d for d in all_selected_docs if d.processed]
            
            if not documents:
                return {
                    'query_id': None,
                    'answer': "Tài liệu đang được hệ thống học. Vui lòng thử lại sau vài giây nữa.",
                    'is_processing': True, # ✅ Trả về cờ hiệu cho Frontend
                    'sources': [],
                    'confidence_score': 0.0,
                    'processing_time_ms': int((time.time() - start_time) * 1000)
                }
            
            valid_doc_ids = [doc.id for doc in documents]
            doc_map = {doc.id: doc for doc in documents}
            
            # --- Step 2: Semantic Search (Embeddings) ---
            logger.info(f"🔎 Searching chunks for docs: {valid_doc_ids}")
            matches = []
            
            # Chiến lược tìm kiếm:
            # Nếu user chọn > 1 file, ta tìm kiếm riêng lẻ từng file rồi gộp lại
            # Để tránh việc 1 file dài chiếm hết kết quả tìm kiếm
            if len(valid_doc_ids) > 1:
                # Chia quota: Ví dụ max 15 results, 3 file -> mỗi file lấy 5 chunk
                chunks_per_doc = max(3, int(max_results / len(valid_doc_ids)) + 2)
                
                for doc_id in valid_doc_ids:
                    doc_matches = await self.embedding_service.search_similar_chunks(
                        query=query_text,
                        document_ids=[doc_id], 
                        top_k=chunks_per_doc
                    )
                    matches.extend(doc_matches)
                
                # Sort lại theo độ tương đồng và cắt đúng số lượng cần thiết
                matches.sort(key=lambda x: x['score'], reverse=True)
                matches = matches[:max_results + 5] # Lấy dư một chút
            else:
                # Nếu chỉ 1 file thì search bình thường
                matches = await self.embedding_service.search_similar_chunks(
                    query=query_text,
                    document_ids=valid_doc_ids,
                    top_k=max_results
                )
            
            # Check if relevant content found
            if not matches or matches[0]['score'] < 0.25:
                return {
                    'query_id': None,
                    'answer': NO_RESULT_RESPONSE.format(query=query_text),
                    'is_processing': False,
                    'sources': [],
                    'confidence_score': 0.0,
                    'processing_time_ms': int((time.time() - start_time) * 1000)
                }
            
            # --- Step 3: Build Context ---
            logger.info(f"📝 Building context from {len(matches)} chunks...")
            # format_context sẽ đánh số [1], [2]... tương ứng thứ tự matches
            context = format_context(matches, doc_map)
            
            # --- Step 4: Call Gemini ---
            logger.info(f"🤖 Generating answer with optimized prompt...")
            raw_answer = await self.gemini_service.generate_answer(
                query=query_text,
                context=context,
                system_instruction=SYSTEM_INSTRUCTION
            )
            
            # --- Step 5: Extract & Clean Sources ---
            logger.info(f"🔍 Extracting sources from AI response...")
            cleaned_answer, sources = self.extract_sources_from_response(
                raw_answer,
                matches,
                doc_map
            )
            
            # --- Step 6: Save to DB (History) ---
            # Tính điểm tin cậy trung bình
            avg_similarity = sum(m['score'] for m in matches) / len(matches)
            confidence_score = min(avg_similarity * 1.5, 1.0)
            
            query_record = QueryModel(
                user_id=user.id,
                conversation_id=conversation_id, # ✅ Atomic linking
                query_text=query_text,
                response_text=cleaned_answer, # Lưu text sạch
                sources=sources,              # ✅ Lưu JSON sources đầy đủ (có title)
                execution_time=int((time.time() - start_time) * 1000),
                rating=None
            )
            
            # Link query với documents (Bảng trung gian)
            query_record.documents = documents
            
            db.add(query_record)
            db.commit()
            db.refresh(query_record)
            
            processing_time = int((time.time() - start_time) * 1000)
            logger.info(f"✅ Query completed in {processing_time}ms with {len(sources)} sources")
            
            return {
                'query_id': query_record.id,
                'answer': cleaned_answer,
                'is_processing': False, # ✅ Hoàn tất
                'sources': sources,
                'confidence_score': round(confidence_score, 2),
                'processing_time_ms': processing_time
            }
            
        except Exception as e:
            logger.error(f"❌ Error in RAG pipeline: {str(e)}")
            # Không raise lỗi để tránh crash UI, trả về thông báo lỗi nhẹ
            return {
                'query_id': None,
                'answer': "Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu này. Vui lòng thử lại.",
                'sources': [],
                'confidence_score': 0.0,
                'processing_time_ms': 0
            }

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