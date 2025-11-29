from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobListResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new job posting"""
    job = Job(
        user_id=current_user.id,
        title=job_data.title,
        description=job_data.description,
        requirements=job_data.requirements,
        skills=job_data.skills,
        min_experience=job_data.min_experience
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    return JobResponse(
        **{
            "id": job.id,
            "title": job.title,
            "description": job.description,
            "requirements": job.requirements,
            "skills": job.skills or [],
            "min_experience": job.min_experience,
            "public_link": job.public_link,
            "status": job.status,
            "created_at": job.created_at,
            "applications_count": 0
        }
    )


@router.get("", response_model=JobListResponse)
def list_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: Optional[str] = None
):
    """List all jobs for current user"""
    query = db.query(Job).filter(Job.user_id == current_user.id)

    if status:
        query = query.filter(Job.status == status)

    jobs = query.order_by(Job.created_at.desc()).all()

    # Get application counts
    job_responses = []
    for job in jobs:
        app_count = db.query(func.count(Application.id)).filter(
            Application.job_id == job.id
        ).scalar()

        job_responses.append(JobResponse(
            id=job.id,
            title=job.title,
            description=job.description,
            requirements=job.requirements,
            skills=job.skills or [],
            min_experience=job.min_experience,
            public_link=job.public_link,
            status=job.status,
            created_at=job.created_at,
            applications_count=app_count
        ))

    return JobListResponse(jobs=job_responses, total=len(job_responses))


@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific job by ID"""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    app_count = db.query(func.count(Application.id)).filter(
        Application.job_id == job.id
    ).scalar()

    return JobResponse(
        id=job.id,
        title=job.title,
        description=job.description,
        requirements=job.requirements,
        skills=job.skills or [],
        min_experience=job.min_experience,
        public_link=job.public_link,
        status=job.status,
        created_at=job.created_at,
        applications_count=app_count
    )


@router.patch("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: UUID,
    job_data: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a job posting"""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    update_data = job_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)

    app_count = db.query(func.count(Application.id)).filter(
        Application.job_id == job.id
    ).scalar()

    return JobResponse(
        id=job.id,
        title=job.title,
        description=job.description,
        requirements=job.requirements,
        skills=job.skills or [],
        min_experience=job.min_experience,
        public_link=job.public_link,
        status=job.status,
        created_at=job.created_at,
        applications_count=app_count
    )


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a job posting"""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    db.delete(job)
    db.commit()
