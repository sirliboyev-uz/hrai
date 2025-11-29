from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


# Request schemas
class JobCreate(BaseModel):
    title: str
    description: str
    requirements: str
    skills: List[str] = []
    min_experience: int = 0


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    skills: Optional[List[str]] = None
    min_experience: Optional[int] = None
    status: Optional[str] = None


# Response schemas
class JobResponse(BaseModel):
    id: UUID
    title: str
    description: str
    requirements: str
    skills: List[str]
    min_experience: int
    public_link: str
    status: str
    created_at: datetime
    applications_count: Optional[int] = 0

    class Config:
        from_attributes = True


class JobPublicResponse(BaseModel):
    """Public job view for candidates (no sensitive data)"""
    id: UUID
    title: str
    description: str
    requirements: str
    skills: List[str]
    min_experience: int
    company_name: Optional[str] = None

    class Config:
        from_attributes = True


class JobListResponse(BaseModel):
    jobs: List[JobResponse]
    total: int
