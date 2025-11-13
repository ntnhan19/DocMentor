from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

# Summary
class SummaryRequest(BaseModel):
    document_id: int
    length: str = Field(default="medium", pattern="^(short|medium|long)$")
    
class SummaryResponse(BaseModel):
    document_id: int
    document_title: str
    summary: str
    length: str
    word_count: int
    created_at: datetime
    
# Key Concepts
class ConceptsRequest(BaseModel):
    document_id: int
    max_concepts: int = Field(default=10, ge=1, le=20)
    
class ConceptsResponse(BaseModel):
    document_id: int
    document_title: str
    concepts: List[str]
    count: int
    
# Quiz
class QuizRequest(BaseModel):
    document_id: int
    num_questions: int = Field(default=5, ge=1, le=20)
    difficulty: str = Field(default="medium", pattern="^(easy|medium|hard)$")
    
class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct: str
    explanation: str
    
class QuizResponse(BaseModel):
    document_id: int
    document_title: str
    questions: List[QuizQuestion]
    difficulty: str
    total_questions: int
    
# Quiz Submission
class QuizSubmission(BaseModel):
    quiz_id: int
    answers: Dict[int, str]  # question index -> selected option
    
class QuizResult(BaseModel):
    quiz_id: int
    total_questions: int
    correct_answers: int
    score_percentage: float
    detailed: List[Dict[str, Any]]  # List of {question, selected, correct, is_correct, explanation}
    passed: bool # True if >= 60%