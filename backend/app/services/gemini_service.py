import google.generativeai as genai
from typing import List, Dict, Any
import logging
import json
import re
from ..config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    """Service for Google Gemini AI"""
    
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        
        self.safety_settings = {
            'HARM_CATEGORY_HARASSMENT': 'BLOCK_NONE',
            'HARM_CATEGORY_HATE_SPEECH': 'BLOCK_NONE',
            'HARM_CATEGORY_SEXUALLY_EXPLICIT': 'BLOCK_NONE',
            'HARM_CATEGORY_DANGEROUS_CONTENT': 'BLOCK_NONE',
        }
        
        logger.info("✅ Gemini 2.5 Flash initialized")
    
    def _safe_get_text(self, response) -> str:
        """Safely extract text from Gemini response"""
        try:
            if hasattr(response, 'text') and response.text:
                return response.text.strip()
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]
                if candidate.content and candidate.content.parts:
                    return candidate.content.parts[0].text
            return ""
        except Exception as e:
            logger.error(f"❌ Error extracting text: {str(e)}")
            return ""

    async def generate_answer(self, query: str, context: str, system_instruction: str = None) -> str:
        """Generate answer for RAG (Non-streaming)"""
        try:
            full_prompt = f"{system_instruction}\n\nCONTEXT:\n{context}\n\nQUERY:\n{query}"
            logger.info("🤖 Generating answer with Gemini 2.5 Flash...")
            
            response = await self.model.generate_content_async(
                full_prompt,
                safety_settings=self.safety_settings,
                generation_config={'temperature': 0.4, 'max_output_tokens': 8192}
            )
            
            return self._safe_get_text(response)
            
        except Exception as e:
            logger.error(f"❌ Error generating answer: {str(e)}", exc_info=True)
            return "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. Vui lòng thử lại sau."

    async def generate_answer_stream(self, query: str, context: str, system_instruction: str = None):
        """Generate answer for RAG (Streaming)"""
        try:
            full_prompt = f"{system_instruction}\n\nCONTEXT:\n{context}\n\nQUERY:\n{query}"
            logger.info("🤖 Streaming answer with Gemini 2.5 Flash...")
            
            response = await self.model.generate_content_async(
                full_prompt,
                safety_settings=self.safety_settings,
                generation_config={'temperature': 0.4, 'max_output_tokens': 8192},
                stream=True
            )
            
            async for chunk in response:
                if chunk.text:
                    yield chunk.text
                    
        except Exception as e:
            logger.error(f"❌ Error streaming answer: {str(e)}", exc_info=True)
            yield "Bị lỗi kết nối khi đang stream dữ liệu. Vui lòng thử lại."

    async def generate_summary(self, text: str, length: str = "medium") -> str:
        """Generate summary"""
        try:
            length_map = {
                "short": "khoảng 5 câu ngắn gọn",
                "medium": "khoảng 1-2 đoạn văn chi tiết",
                "long": "bài tóm tắt đầy đủ chi tiết"
            }
            
            prompt = f"""Hãy tóm tắt văn bản sau đây ({length_map.get(length, "vừa phải")}).
            Chỉ đưa ra nội dung tóm tắt, không thêm lời dẫn.
            
            VĂN BẢN:
            {text[:20000]} 
            """ # Giới hạn ký tự đầu vào

            response = await self.model.generate_content_async(
                prompt,
                safety_settings=self.safety_settings
            )
            
            return self._safe_get_text(response)
            
        except Exception as e:
            logger.error(f"❌ Error generating summary: {str(e)}")
            return "Không thể tạo tóm tắt."

    async def generate_quiz(self, text: str, num_questions: int = 5, difficulty: str = "medium") -> List[Dict[str, Any]]:
        """Generate quiz"""
        try:
            prompt = f"""Tạo {num_questions} câu hỏi trắc nghiệm (độ khó {difficulty}) từ văn bản.
            Output JSON format:
            [
                {{
                    "question": "...",
                    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
                    "correct": "A",
                    "explanation": "..."
                }}
            ]
            
            VĂN BẢN:
            {text[:20000]}
            """

            response = await self.model.generate_content_async(
                prompt,
                safety_settings=self.safety_settings,
                generation_config={'response_mime_type': 'application/json'} # Gemini mode JSON
            )
            
            json_text = self._safe_get_text(response)
            # Clean markdown JSON if needed
            json_text = json_text.replace('```json', '').replace('```', '').strip()
            
            return json.loads(json_text)
            
        except Exception as e:
            logger.error(f"❌ Error generating quiz: {str(e)}")
            return []
            
    async def extract_key_concepts(self, text: str, max_concepts: int = 10) -> List[str]:
        try:
            prompt = f"Liệt kê {max_concepts} khái niệm/từ khóa quan trọng nhất từ văn bản này. Mỗi dòng 1 từ."
            response = await self.model.generate_content_async(prompt)
            result = self._safe_get_text(response)
            return [line.strip('-•* ') for line in result.split('\n') if line.strip()][:max_concepts]
        except Exception:
            return []