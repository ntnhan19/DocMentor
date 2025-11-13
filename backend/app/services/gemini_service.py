import google.generativeai as genai
from typing import List, Dict, Any
import logging
from ..config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    """Service for Google Gemini AI"""
    
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.chat_model = genai.GenerativeModel('models/gemini-2.5-flash')
        
        # ✅ Configure safety settings (less strict)
        self.safety_settings = {
            'HARM_CATEGORY_HARASSMENT': 'BLOCK_NONE',
            'HARM_CATEGORY_HATE_SPEECH': 'BLOCK_NONE',
            'HARM_CATEGORY_SEXUALLY_EXPLICIT': 'BLOCK_NONE',
            'HARM_CATEGORY_DANGEROUS_CONTENT': 'BLOCK_NONE',
        }
        
        logger.info("✅ Gemini 2.5 Flash initialized")
    
    def _safe_get_text(self, response) -> str:
        """
        Safely extract text from Gemini response
        Handle cases where response is blocked or empty
        """
        try:
            # Check if response has text
            if hasattr(response, 'text') and response.text:
                return response.text.strip()
            
            # Check candidates
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]
                
                # Check finish reason
                if hasattr(candidate, 'finish_reason'):
                    finish_reason = candidate.finish_reason
                    
                    # 0 = FINISH_REASON_UNSPECIFIED
                    # 1 = STOP (success)
                    # 2 = MAX_TOKENS
                    # 3 = SAFETY
                    # 4 = RECITATION
                    # 5 = OTHER
                    
                    if finish_reason == 3:  # SAFETY
                        logger.warning("⚠️ Response blocked by safety filter")
                        return "⚠️ Response blocked by safety filter. Please try rephrasing."
                    elif finish_reason == 2:  # MAX_TOKENS
                        logger.warning("⚠️ Response truncated (max tokens)")
                        # Try to get partial text
                        if hasattr(candidate.content, 'parts') and candidate.content.parts:
                            return candidate.content.parts[0].text
                        return "⚠️ Response too long. Please try with shorter content."
                
                # Try to get content parts
                if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                    if candidate.content.parts:
                        return candidate.content.parts[0].text
            
            # If nothing works
            logger.error("❌ No valid text in response")
            return ""
            
        except Exception as e:
            logger.error(f"❌ Error extracting text: {str(e)}")
            return ""
    
    async def generate_answer(
        self, 
        query: str, 
        context: str,
        system_instruction: str = None
    ) -> str:
        """Generate answer using Gemini"""
        try:
            prompt = f"""Bạn là trợ giảng AI. Trả lời dựa trên context.

CONTEXT:
{context[:8000]}

CÂU HỎI: {query}

TRẢ LỜI (ngắn gọn):"""

            response = self.chat_model.generate_content(
                prompt,
                safety_settings=self.safety_settings,
                generation_config={
                    'temperature': 0.3,
                    'max_output_tokens': 1024,
                }
            )
            
            answer = self._safe_get_text(response)
            return answer if answer else "Không thể tạo câu trả lời. Vui lòng thử lại."
            
        except Exception as e:
            logger.error(f"❌ Error: {str(e)}")
            return f"Lỗi: {str(e)[:100]}"
    
    async def generate_summary(self, text: str, length: str = "medium") -> str:
        """Generate summary"""
        try:
            length_map = {
                "short": "5 câu ngắn gọn",
                "medium": "1-2 đoạn văn (~150 từ)",
                "long": "3-4 đoạn văn (~300 từ)"  # ✅ Reduce from 500 to 300
            }
            
            # ✅ Limit text length based on summary type
            text_limits = {
                "short": 8000,
                "medium": 10000,
                "long": 12000
            }
            
            text_limit = text_limits.get(length, 10000)
            
            prompt = f"""Tóm tắt nội dung sau ({length_map.get(length, "1-2 đoạn văn")}):

NỘI DUNG:
{text[:text_limit]}

TÓM TẮT (chỉ tóm tắt, không thêm nhận xét):"""

            response = self.chat_model.generate_content(
                prompt,
                safety_settings=self.safety_settings,
                generation_config={
                    'temperature': 0.4,
                    'max_output_tokens': 2048,
                }
            )
            
            summary = self._safe_get_text(response)
            return summary if summary else "Không thể tạo tóm tắt. Vui lòng thử lại."
            
        except Exception as e:
            logger.error(f"❌ Error: {str(e)}")
            return "Không thể tạo tóm tắt. Vui lòng thử lại."
    
    async def extract_key_concepts(self, text: str, max_concepts: int = 10) -> List[str]:
        """Extract key concepts"""
        try:
            prompt = f"""Liệt kê {max_concepts} khái niệm quan trọng từ văn bản.

Yêu cầu:
- Mỗi dòng 1 khái niệm
- Chỉ tên khái niệm, không giải thích
- Không đánh số, không dấu gạch đầu dòng

VĂN BẢN:
{text[:8000]}

DANH SÁCH:"""

            response = self.chat_model.generate_content(
                prompt,
                safety_settings=self.safety_settings,
                generation_config={
                    'temperature': 0.2,
                    'max_output_tokens': 512,
                }
            )
            
            result_text = self._safe_get_text(response)
            
            if not result_text:
                logger.warning("⚠️ No concepts extracted")
                return []
            
            # Parse concepts
            concepts = []
            for line in result_text.split('\n'):
                # Clean line
                clean = line.strip()
                # Remove common prefixes
                clean = clean.lstrip('•-*0123456789. ')
                # Remove quotes
                clean = clean.strip('"\'')
                
                if clean and len(clean) > 2 and len(clean) < 100:
                    concepts.append(clean)
            
            logger.info(f"✅ Extracted {len(concepts)} concepts")
            return concepts[:max_concepts]
            
        except Exception as e:
            logger.error(f"❌ Error: {str(e)}")
            return []
    
    async def generate_quiz(
        self, 
        text: str, 
        num_questions: int = 5,
        difficulty: str = "medium"
    ) -> List[Dict[str, Any]]:
        """Generate quiz questions"""
        try:
            prompt = f"""Tạo CHÍNH XÁC {num_questions} câu hỏi trắc nghiệm.

YÊU CẦU:
- Tạo đúng {num_questions} câu
- Mỗi câu có 4 đáp án (A, B, C, D)
- Chỉ 1 đáp án đúng
- Format JSON

NỘI DUNG:
{text[:7000]}

JSON (chỉ JSON, không text khác):
[
  {{
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correct": "A",
    "explanation": "..."
  }}
]"""

            response = self.chat_model.generate_content(
                prompt,
                safety_settings=self.safety_settings,
                generation_config={
                    'temperature': 0.5,
                    'max_output_tokens': 2048,
                }
            )
            
            result_text = self._safe_get_text(response)
            
            if not result_text:
                logger.warning("⚠️ No quiz generated")
                return []
            
            # Parse JSON
            import json
            import re
            
            # Extract JSON
            json_text = result_text
            if "```json" in json_text:
                match = re.search(r'```json\s*(.*?)\s*```', json_text, re.DOTALL)
                if match:
                    json_text = match.group(1)
            elif "```" in json_text:
                match = re.search(r'```\s*(.*?)\s*```', json_text, re.DOTALL)
                if match:
                    json_text = match.group(1)
            
            # Try to find JSON array in text
            if not json_text.strip().startswith('['):
                match = re.search(r'(\[.*\])', json_text, re.DOTALL)
                if match:
                    json_text = match.group(1)
            
            questions = json.loads(json_text)
            
            # Validate questions
            valid_questions = []
            for q in questions:
                if all(key in q for key in ['question', 'options', 'correct', 'explanation']):
                    valid_questions.append(q)
            
            logger.info(f"✅ Generated {len(valid_questions)} valid questions")
            return valid_questions[:num_questions]
            
        except json.JSONDecodeError as e:
            logger.error(f"❌ JSON parse error: {str(e)}")
            logger.error(f"Response: {result_text[:500]}")
            return []
        except Exception as e:
            logger.error(f"❌ Error: {str(e)}")
            return []