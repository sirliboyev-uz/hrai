import uuid
import secrets
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.database import Base


def generate_public_link():
    """Generate a unique 8-character public link"""
    return secrets.token_urlsafe(6)[:8]


class Job(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=False)
    skills = Column(JSONB, default=list)
    min_experience = Column(Integer, default=0)

    public_link = Column(String(20), unique=True, default=generate_public_link, index=True)
    status = Column(String(20), default="published")  # draft, published, closed

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Job {self.title}>"
