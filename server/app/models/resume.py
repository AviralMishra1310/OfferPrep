from datetime import datetime

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Resume(Base):

    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    original_filename: Mapped[str] = mapped_column(
        String(255)
    )

    stored_filename: Mapped[str] = mapped_column(
        String(255)
    )

    uploaded_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow
    )

    user: Mapped["User"] = relationship(
        back_populates="resumes"
    )