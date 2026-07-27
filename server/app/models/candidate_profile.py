from datetime import datetime
from typing import List, Optional

from sqlalchemy import ForeignKey, String, Text, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class CandidateProfile(Base):

    __tablename__ = "candidate_profiles"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
        nullable=False,
        index=True
    )

    resume_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("resumes.id"),
        nullable=True
    )

    name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )

    email: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )

    phone: Mapped[Optional[str]] = mapped_column(
        String(30),
        nullable=True
    )

    skills: Mapped[List[str]] = mapped_column(
        JSON,
        default=list
    )

    education: Mapped[List[str]] = mapped_column(
        JSON,
        default=list
    )

    projects: Mapped[List[str]] = mapped_column(
        JSON,
        default=list
    )

    experience: Mapped[List[str]] = mapped_column(
        JSON,
        default=list
    )

    raw_text: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user: Mapped["User"] = relationship(
        back_populates="candidate_profile"
    )

    resume: Mapped[Optional["Resume"]] = relationship(
        back_populates="candidate_profile"
    )