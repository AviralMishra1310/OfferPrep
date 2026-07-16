from pathlib import Path
import shutil
import uuid
from fastapi.responses import FileResponse
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.dependencies import get_db
from app.models.resume import Resume
from app.models.user import User

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Delete old resume if exists
    old_resume = (
        db.query(Resume)
        .filter(Resume.user_id == user.id)
        .order_by(Resume.uploaded_at.desc())
        .first()
    )

    if old_resume:
        old_file = UPLOAD_DIR / old_resume.stored_filename
        if old_file.exists():
            old_file.unlink()

        db.delete(old_resume)
        db.commit()

    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    file_path = UPLOAD_DIR / unique_filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume = Resume(
        user_id=user.id,
        original_filename=file.filename,
        stored_filename=unique_filename,
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume uploaded successfully",
        "resume_id": resume.id,
        "filename": resume.original_filename,
    }


@router.get("/latest")
def get_latest_resume(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    resume = (
        db.query(Resume)
        .filter(Resume.user_id == user.id)
        .order_by(Resume.uploaded_at.desc())
        .first()
    )

    if not resume:
        return None

    return {
        "id": resume.id,
        "filename": resume.original_filename,
        "uploaded_at": resume.uploaded_at,
    }

@router.get("/view")
def view_resume(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    resume = (
        db.query(Resume)
        .filter(Resume.user_id == user.id)
        .order_by(Resume.uploaded_at.desc())
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    file_path = UPLOAD_DIR / resume.stored_filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Resume file not found"
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=resume.original_filename,
    )

@router.delete("/delete")
def delete_resume(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    resume = (
        db.query(Resume)
        .filter(Resume.user_id == user.id)
        .order_by(Resume.uploaded_at.desc())
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    file_path = UPLOAD_DIR / resume.stored_filename

    if file_path.exists():
        file_path.unlink()

    db.delete(resume)
    db.commit()

    return {
        "message": "Resume deleted successfully"
    }