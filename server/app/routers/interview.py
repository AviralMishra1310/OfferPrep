from pathlib import Path
import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.dependencies import get_db

from app.models.user import User
from app.models.interview import InterviewSession
from app.models.interview_answer import InterviewAnswer

from app.schemas.interview import (
    InterviewStart,
    InterviewResponse,
    QuestionResponse,
    AnswerRequest,
    InterviewSubmit,
)

router = APIRouter(
    prefix="/interview",
    tags=["Interview"],
)


# =========================================================
# START INTERVIEW
# =========================================================

@router.post("/start", response_model=InterviewResponse)
def start_interview(
    interview: InterviewStart,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    session = InterviewSession(
        user_id=current_user.id,
        role=interview.role,
        company=interview.company,
        interview_type=interview.interview_type,
        difficulty=interview.difficulty,
        total_questions=interview.total_questions,
        status="active",
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


# =========================================================
# CURRENT SESSION
# =========================================================

@router.get("/session", response_model=InterviewResponse)
def get_current_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.user_id == current_user.id,
            InterviewSession.status == "active",
        )
        .order_by(
            InterviewSession.created_at.desc()
        )
        .first()
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="No active interview found."
        )

    return session


# =========================================================
# LOAD QUESTIONS
# =========================================================

@router.get(
    "/questions",
    response_model=list[QuestionResponse],
)
def get_questions(
    count: int = 5,
    current_user: User = Depends(get_current_user),
):

    file_path = Path("questions") / "sde.json"

    with open(
        file_path,
        "r",
        encoding="utf-8",
    ) as file:

        questions = json.load(file)

    return questions[:count]


# =========================================================
# SAVE ANSWER
# =========================================================

@router.post("/answer")
def save_answer(
    answer: AnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.id == answer.session_id,
            InterviewSession.user_id == current_user.id,
        )
        .first()
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found."
        )

    interview_answer = InterviewAnswer(
        session_id=answer.session_id,
        question_id=answer.question_id,
        question=answer.question,
        answer=answer.answer,
    )

    db.add(interview_answer)
    db.commit()

    return {
        "message": "Answer saved successfully."
    }


# =========================================================
# SUBMIT
# =========================================================

@router.post("/submit")
def submit_interview(
    interview: InterviewSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.id == interview.session_id,
            InterviewSession.user_id == current_user.id,
        )
        .first()
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found."
        )

    session.status = "completed"
    session.completed_at = datetime.utcnow()

    db.commit()

    return {
        "message": "Interview submitted successfully."
    }


# =========================================================
# HISTORY
# =========================================================

@router.get("/history")
def interview_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    history = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.user_id == current_user.id
        )
        .order_by(
            InterviewSession.created_at.desc()
        )
        .all()
    )

    return history


# =========================================================
# DETAILS
# =========================================================

@router.get("/{session_id}")
def interview_details(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.id == session_id,
            InterviewSession.user_id == current_user.id,
        )
        .first()
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Interview not found."
        )

    answers = (
        db.query(InterviewAnswer)
        .filter(
            InterviewAnswer.session_id == session.id
        )
        .all()
    )

    return {
        "session": session,
        "answers": answers,
    }