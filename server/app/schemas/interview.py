from pydantic import BaseModel
from datetime import datetime


class InterviewStart(BaseModel):
    role: str
    difficulty: str
    total_questions: int


class InterviewResponse(BaseModel):
    id: int
    role: str
    difficulty: str
    total_questions: int
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }