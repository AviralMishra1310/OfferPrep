from pathlib import Path
import shutil
import uuid
from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.dependencies import get_db
from app.models.resume import Resume
from app.models.user import User
from app.models.candidate_profile import CandidateProfile

from ml.parsers.resume_parser import (
    extract_text_from_pdf,
    parse_resume,
)
from ml.utils.text_cleaner import clean_text
from ml.extractors.skill_extractor import extract_skills


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


# =========================================================
# HELPER - GET LOGGED-IN USER
# =========================================================

def get_logged_in_user(
    current_user,
    db: Session,
):

    user = db.query(User).filter(
        User.email == current_user.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

# =========================================================
# HELPER - GET LATEST RESUME
# =========================================================

def get_user_latest_resume(
    user_id: int,
    db: Session,
):

    resume = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .order_by(Resume.uploaded_at.desc())
        .first()
    )

    return resume


# =========================================================
# UPLOAD RESUME
# =========================================================

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

    user = get_logged_in_user(
        current_user,
        db
    )

    # Get old resume
    old_resume = get_user_latest_resume(
        user.id,
        db
    )

    if old_resume:

        old_file = (
            UPLOAD_DIR /
            old_resume.stored_filename
        )

        if old_file.exists():
            old_file.unlink()

        # CandidateProfile may reference this resume.
        # Remove the reference before deleting old resume.
        existing_profile = (
            db.query(CandidateProfile)
            .filter(
                CandidateProfile.user_id == user.id
            )
            .first()
        )

        if existing_profile:
            existing_profile.resume_id = None

        db.delete(old_resume)
        db.commit()

    unique_filename = (
        f"{uuid.uuid4()}_{file.filename}"
    )

    file_path = (
        UPLOAD_DIR /
        unique_filename
    )

    try:

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

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

    except Exception:

        db.rollback()

        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=500,
            detail="Failed to upload resume"
        )


# =========================================================
# GET LATEST RESUME
# =========================================================

@router.get("/latest")
def get_latest_resume(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    user = get_logged_in_user(
        current_user,
        db
    )

    resume = get_user_latest_resume(
        user.id,
        db
    )

    if not resume:
        return None

    return {
        "id": resume.id,
        "filename": resume.original_filename,
        "uploaded_at": resume.uploaded_at,
    }


# =========================================================
# VIEW RESUME
# =========================================================

@router.get("/view")
def view_resume(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    user = get_logged_in_user(
        current_user,
        db
    )

    resume = get_user_latest_resume(
        user.id,
        db
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    file_path = (
        UPLOAD_DIR /
        resume.stored_filename
    )

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


# =========================================================
# DELETE RESUME
# =========================================================

@router.delete("/delete")
def delete_resume(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    user = get_logged_in_user(
        current_user,
        db
    )

    resume = get_user_latest_resume(
        user.id,
        db
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    file_path = (
        UPLOAD_DIR /
        resume.stored_filename
    )

    try:

        existing_profile = (
            db.query(CandidateProfile)
            .filter(
                CandidateProfile.user_id == user.id
            )
            .first()
        )

        if existing_profile:
            db.delete(existing_profile)

        db.delete(resume)

        db.commit()

        if file_path.exists():
            file_path.unlink()

        return {
            "message": "Resume deleted successfully"
        }

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to delete resume"
        )


# =========================================================
# PARSE RESUME + SAVE CANDIDATE PROFILE
# =========================================================

@router.post("/parse")
def parse_latest_resume(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    user = get_logged_in_user(
        current_user,
        db
    )

    resume = get_user_latest_resume(
        user.id,
        db
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found. Please upload a resume first."
        )

    file_path = (
        UPLOAD_DIR /
        resume.stored_filename
    )

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Resume file not found"
        )

    try:

        # ---------------------------------------------
        # STEP 1 - PDF TEXT EXTRACTION
        # ---------------------------------------------

        raw_text = extract_text_from_pdf(
            str(file_path)
        )

        if not raw_text:

            raise HTTPException(
                status_code=400,
                detail="Could not extract text from resume"
            )

        # ---------------------------------------------
        # STEP 2 - TEXT CLEANING
        # ---------------------------------------------

        cleaned_text = clean_text(
            raw_text
        )

        # ---------------------------------------------
        # STEP 3 - BASIC RESUME PARSING
        # ---------------------------------------------

        profile_data = parse_resume(
            cleaned_text
        )

        # ---------------------------------------------
        # STEP 4 - SKILL EXTRACTION
        # ---------------------------------------------

        profile_data["skills"] = (
            extract_skills(
                cleaned_text
            )
        )

        # ---------------------------------------------
        # STEP 5 - CHECK EXISTING PROFILE
        # ---------------------------------------------

        candidate_profile = (
            db.query(CandidateProfile)
            .filter(
                CandidateProfile.user_id == user.id
            )
            .first()
        )

        # ---------------------------------------------
        # STEP 6A - UPDATE EXISTING PROFILE
        # ---------------------------------------------

        if candidate_profile:

            candidate_profile.resume_id = (
                resume.id
            )

            candidate_profile.name = (
                profile_data.get("name")
            )

            candidate_profile.email = (
                profile_data.get("email")
            )

            candidate_profile.phone = (
                profile_data.get("phone")
            )

            candidate_profile.skills = (
                profile_data.get(
                    "skills",
                    []
                )
            )

            candidate_profile.education = (
                profile_data.get(
                    "education",
                    []
                )
            )

            candidate_profile.projects = (
                profile_data.get(
                    "projects",
                    []
                )
            )

            candidate_profile.experience = (
                profile_data.get(
                    "experience",
                    []
                )
            )

            candidate_profile.raw_text = (
                cleaned_text
            )

            candidate_profile.updated_at = (
                datetime.utcnow()
            )

            action = "updated"

        # ---------------------------------------------
        # STEP 6B - CREATE NEW PROFILE
        # ---------------------------------------------

        else:

            candidate_profile = CandidateProfile(

                user_id=user.id,

                resume_id=resume.id,

                name=profile_data.get(
                    "name"
                ),

                email=profile_data.get(
                    "email"
                ),

                phone=profile_data.get(
                    "phone"
                ),

                skills=profile_data.get(
                    "skills",
                    []
                ),

                education=profile_data.get(
                    "education",
                    []
                ),

                projects=profile_data.get(
                    "projects",
                    []
                ),

                experience=profile_data.get(
                    "experience",
                    []
                ),

                raw_text=cleaned_text,
            )

            db.add(
                candidate_profile
            )

            action = "created"

        # ---------------------------------------------
        # STEP 7 - SAVE
        # ---------------------------------------------

        db.commit()

        db.refresh(
            candidate_profile
        )

        # ---------------------------------------------
        # STEP 8 - RESPONSE
        # ---------------------------------------------

        return {

            "message": (
                "Resume parsed and candidate "
                f"profile {action} successfully"
            ),

            "resume": {

                "id": resume.id,

                "filename":
                    resume.original_filename,

                "uploaded_at":
                    resume.uploaded_at,
            },

            "candidate_profile": {

                "id":
                    candidate_profile.id,

                "name":
                    candidate_profile.name,

                "email":
                    candidate_profile.email,

                "phone":
                    candidate_profile.phone,

                "skills":
                    candidate_profile.skills,

                "education":
                    candidate_profile.education,

                "projects":
                    candidate_profile.projects,

                "experience":
                    candidate_profile.experience,

                "created_at":
                    candidate_profile.created_at,

                "updated_at":
                    candidate_profile.updated_at,
            },
        }

    except HTTPException:

        db.rollback()

        raise

    except Exception as error:

        db.rollback()

        print(
            "Resume parsing error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to parse and save resume"
        )


# =========================================================
# GET SAVED CANDIDATE PROFILE
# =========================================================

@router.get("/profile")
def get_candidate_profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    user = get_logged_in_user(
        current_user,
        db
    )

    candidate_profile = (
        db.query(CandidateProfile)
        .filter(
            CandidateProfile.user_id == user.id
        )
        .first()
    )

    if not candidate_profile:
        return None

    return {
        "id": candidate_profile.id,
        "resume_id": candidate_profile.resume_id,
        "name": candidate_profile.name,
        "email": candidate_profile.email,
        "phone": candidate_profile.phone,
        "skills": candidate_profile.skills or [],
        "education": candidate_profile.education or [],
        "projects": candidate_profile.projects or [],
        "experience": candidate_profile.experience or [],
        "created_at": candidate_profile.created_at,
        "updated_at": candidate_profile.updated_at,
    }