import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    full_name = Column(String(255), nullable=False)
    years_of_experience = Column(Integer, nullable=True)
    current_company = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Candidate {self.full_name}>"
