from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime
from decimal import Decimal


# Request schemas
class ApplicationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    years_of_experience: Optional[int] = None


class ApplicationAction(BaseModel):
    action: str  # interview, reject, hire


class ApplicationNoteCreate(BaseModel):
    note: str


# Nested schemas
class CandidateInfo(BaseModel):
    id: UUID
    full_name: str
    email: str
    phone: Optional[str]
    years_of_experience: Optional[int]

    class Config:
        from_attributes = True


class ScoreBreakdown(BaseModel):
    skills: float
    experience: float


class ParsedResumeData(BaseModel):
    raw_text: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    name: Optional[str] = None
    skills: List[str] = []
    years_of_experience: Optional[int] = None


# Response schemas
class ApplicationResponse(BaseModel):
    id: UUID
    candidate: CandidateInfo
    ai_score: Optional[Decimal]
    score_breakdown: Optional[dict]
    explanation: Optional[str]
    status: str
    applied_at: datetime
    resume_path: Optional[str]

    class Config:
        from_attributes = True


class ApplicationDetailResponse(BaseModel):
    """Detailed response for single application view"""
    id: UUID
    candidate: CandidateInfo
    ai_score: Optional[Decimal]
    score_breakdown: Optional[dict]
    explanation: Optional[str]
    status: str
    applied_at: datetime
    resume_path: Optional[str]
    # Additional detailed fields
    resume_parsed: Optional[dict] = None
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    strengths: List[str] = []
    concerns: List[str] = []
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class ApplicationListResponse(BaseModel):
    applications: List[ApplicationResponse]
    total: int


class ApplicationSubmitResponse(BaseModel):
    message: str
    application_id: UUID
