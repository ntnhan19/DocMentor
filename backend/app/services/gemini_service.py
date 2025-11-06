import google.generativeai as genai
from typing import List, Dict, Any
import logging
from ..config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    """
    Service for interacting with Google Gemini AI
    Features:
    - Text generation (for RAG answers)
    - Embeddings (if needed later)
    - Structured output
    """
    
    def __init__(self):
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # Initialize models
        self.chat_model = genai.GenerativeModel('gemini-2.5-flash')
        
        logger.info("✅ Gemini service initialized")
    
    async def generate_answer(
        self, 
        query: str, 
        context: str,
        system_instruction: str = None
    ) -> str:
        """
        Generate answer using Gemini based on context
        
        Args:
            query: User's question
            context: Retrieved context from documents
            system_instruction: Optional system instructions
        
        Returns:
            Generated answer
        """
        try:
            # Build prompt
            if system_instruction:
                prompt = f"""{system_instruction}

CONTEXT (Trích từ tài liệu):
{context}

QUESTION:
{query}

ANSWER (Trả lời bằng tiếng Việt, dựa trên context trên):"""
            else:
                prompt = f"""Bạn là một trợ giảng thông minh. Nhiệm vụ của bạn là trả lời câu hỏi của sinh viên dựa HOÀN TOÀN trên nội dung được cung cấp.

QUY TẮC:
1. Chỉ trả lời dựa trên CONTEXT bên dưới
2. Trả lời bằng tiếng Việt rõ ràng, dễ hiểu
3. Trích dẫn nguồn khi cần: [Nguồn: tên tài liệu]
4. Nếu không tìm thấy thông tin, nói rõ "Tôi không tìm thấy thông tin về..."
5. KHÔNG bịa đặt thông tin không có trong context

CONTEXT (Trích từ tài liệu):
{context}

QUESTION:
{query}

ANSWER (Trả lời ngắn gọn, súc tích):"""

            # Generate response
            logger.info("🤖 Generating answer with Gemini...")
            response = self.chat_model.generate_content(prompt)
            
            answer = response.text.strip()
            logger.info(f"✅ Answer generated: {len(answer)} characters")
            
            return answer
            
        except Exception as e:
            logger.error(f"❌ Error generating answer: {str(e)}")
            raise
    
    async def generate_summary(self, text: str, length: str = "medium") -> str:
        """
        Generate summary of document
        
        Args:
            text: Document text
            length: "short", "medium", or "long"
        
        Returns:
            Summary text
        """
        try:
            length_instructions = {
                "short": "5 câu ngắn gọn",
                "medium": "1-2 đoạn văn",
                "long": "chi tiết theo từng phần"
            }
            
            prompt = f"""Tóm tắt nội dung sau bằng tiếng Việt, độ dài: {length_instructions.get(length, "1-2 đoạn văn")}

NỘI DUNG:
{text[:10000]}  # Limit to first 10K chars

TÓM TẮT:"""

            response = self.chat_model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"❌ Error generating summary: {str(e)}")
            raise
    
    async def extract_key_concepts(self, text: str) -> List[str]:
        """
        Extract key concepts from text
        
        Args:
            text: Document text
            
        Returns:
            List of key concepts
        """
        try:
            prompt = f"""Trích xuất các khái niệm chính từ văn bản sau. Chỉ liệt kê các thuật ngữ quan trọng, mỗi thuật ngữ trên một dòng.

VĂN BẢN:
{text[:8000]}

KHÁI NIỆM CHÍNH (mỗi dòng một khái niệm):"""

            response = self.chat_model.generate_content(prompt)
            concepts = [line.strip() for line in response.text.split('\n') if line.strip()]
            
            return concepts[:15]  # Return top 15
            
        except Exception as e:
            logger.error(f"❌ Error extracting concepts: {str(e)}")
            raise
    
    async def generate_quiz(
        self, 
        text: str, 
        num_questions: int = 5,
        difficulty: str = "medium"
    ) -> List[Dict[str, Any]]:
        """
        Generate quiz questions from text
        
        Args:
            text: Document text
            num_questions: Number of questions to generate
            difficulty: "easy", "medium", or "hard"
            
        Returns:
            List of quiz questions with options and answers
        """
        try:
            prompt = f"""Tạo {num_questions} câu hỏi trắc nghiệm (multiple choice) từ nội dung sau, độ khó: {difficulty}.

YÊU CẦU:
- Mỗi câu hỏi có 4 đáp án (A, B, C, D)
- Chỉ có 1 đáp án đúng
- Format JSON như sau:
[
  {{
    "question": "Câu hỏi ở đây?",
    "options": ["A. Đáp án 1", "B. Đáp án 2", "C. Đáp án 3", "D. Đáp án 4"],
    "correct": "A",
    "explanation": "Giải thích ngắn gọn"
  }}
]

NỘI DUNG:
{text[:8000]}

JSON OUTPUT:"""

            response = self.chat_model.generate_content(prompt)
            
            # Parse JSON from response (basic parsing)
            import json
            import re
            
            # Extract JSON from markdown code blocks if present
            json_text = response.text.strip()
            if "```json" in json_text:
                json_text = re.search(r'```json\n(.*?)\n```', json_text, re.DOTALL).group(1)
            elif "```" in json_text:
                json_text = re.search(r'```\n(.*?)\n```', json_text, re.DOTALL).group(1)
            
            questions = json.loads(json_text)
            return questions
            
        except Exception as e:
            logger.error(f"❌ Error generating quiz: {str(e)}")
            raise