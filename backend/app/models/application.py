import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Numeric, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)

    # Resume data
    resume_path = Column(String(500), nullable=True)
    resume_parsed = Column(JSONB, nullable=True)

    # AI scoring
    ai_score = Column(Numeric(5, 2), nullable=True)
    score_breakdown = Column(JSONB, nullable=True)
    explanation = Column(Text, nullable=True)

    # Status: applied, reviewed, interview, rejected, hired
    status = Column(String(30), default="applied")

    # HR notes
    notes = Column(Text, nullable=True)

    applied_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    job = relationship("Job", back_populates="applications")
    candidate = relationship("Candidate", back_populates="applications")

    # Constraints
    __table_args__ = (
        UniqueConstraint("job_id", "candidate_id", name="unique_job_candidate"),
    )

    def __repr__(self):
        return f"<Application {self.id}>"
