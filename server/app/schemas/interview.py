from datetime import datetime
from pydantic import BaseModel


class InterviewStart(BaseModel):
    role: str
    company: str
    interview_type: str
    difficulty: str
    total_questions: int


class InterviewResponse(BaseModel):
    id: int
    role: str
    company: str
    interview_type: str
    difficulty: str
    total_questions: int
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class QuestionResponse(BaseModel):
    id: int
    question: str


class AnswerRequest(BaseModel):
    session_id: int
    question_id: int
    question: str
    answer: str


class InterviewSubmit(BaseModel):
    session_id: int