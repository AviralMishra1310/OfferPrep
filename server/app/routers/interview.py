from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
from pathlib import Path

from app.database.dependencies import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.interview import InterviewSession
from app.models.interview_answer import InterviewAnswer
from app.schemas.interview import (
    InterviewStart,
    InterviewResponse,
    QuestionResponse,
    AnswerRequest
)

router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)


@router.post("/start", response_model=InterviewResponse)
def start_interview(
    interview: InterviewStart,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    session = InterviewSession(
        user_id=current_user.id,
        role=interview.role,
        difficulty=interview.difficulty,
        total_questions=interview.total_questions,
        status="active"
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


@router.get("/session", response_model=InterviewResponse)
def get_current_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.user_id == current_user.id,
            InterviewSession.status == "active"
        )
        .order_by(InterviewSession.created_at.desc())
        .first()
    )

    return session


@router.get("/questions", response_model=list[QuestionResponse])
def get_questions(
    count: int = 5,
    current_user: User = Depends(get_current_user)
):

    file_path = Path("questions") / "sde.json"

    with open(file_path, "r", encoding="utf-8") as file:
        questions = json.load(file)

    return questions[:count]

@router.post("/answer")
def save_answer(
    answer: AnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.id == answer.session_id,
            InterviewSession.user_id == current_user.id
        )
        .first()
    )

    if session is None:
        return {
            "message": "Interview session not found."
        }

    interview_answer = InterviewAnswer(
        session_id=answer.session_id,
        question_id=answer.question_id,
        question=answer.question,
        answer=answer.answer
    )

    db.add(interview_answer)
    db.commit()

    return {
        "message": "Answer saved successfully."
    }