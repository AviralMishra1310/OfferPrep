from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.interview import InterviewSession
from app.schemas.interview import InterviewStart, InterviewResponse

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