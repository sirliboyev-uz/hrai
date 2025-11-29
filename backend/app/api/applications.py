import os
import uuid
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.candidate import Candidate
from app.models.application import Application
from app.schemas.application import (
    ApplicationResponse,
    ApplicationDetailResponse,
    ApplicationListResponse,
    ApplicationSubmitResponse,
    ApplicationAction,
    ApplicationNoteCreate,
    CandidateInfo
)
from app.schemas.job import JobPublicResponse
from app.api.deps import get_current_user
from app.ml.resume_parser import resume_parser
from app.ml.scorer import scorer
from app.ml.ai_analyzer import ai_analyzer
from app.config import get_settings

settings = get_settings()

router = APIRouter(tags=["Applications"])


# Public endpoints (no auth required)

@router.get("/public/jobs/{public_link}", response_model=JobPublicResponse)
def get_public_job(public_link: str, db: Session = Depends(get_db)):
    """Get job by public link (for candidates)"""
    job = db.query(Job).filter(
        Job.public_link == public_link,
        Job.status == "published"
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or no longer accepting applications"
        )

    # Get company name from user
    user = db.query(User).filter(User.id == job.user_id).first()

    return JobPublicResponse(
        id=job.id,
        title=job.title,
        description=job.description,
        requirements=job.requirements,
        skills=job.skills or [],
        min_experience=job.min_experience,
        company_name=user.company_name if user else None
    )


@router.post("/public/apply/{public_link}", response_model=ApplicationSubmitResponse)
async def submit_application(
    public_link: str,
    full_name: str = Form(...),
    email: str = Form(...),
    phone: Optional[str] = Form(None),
    years_of_experience: Optional[int] = Form(None),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Submit an application (for candidates)"""
    # Find the job
    job = db.query(Job).filter(
        Job.public_link == public_link,
        Job.status == "published"
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or no longer accepting applications"
        )

    # Validate file
    if not resume.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume file is required"
        )

    file_ext = resume.filename.split('.')[-1].lower()
    if file_ext not in settings.allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed: {', '.join(settings.allowed_extensions)}"
        )

    # Check file size
    content = await resume.read()
    if len(content) > settings.max_file_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {settings.max_file_size // 1024 // 1024}MB"
        )

    # Find or create candidate
    candidate = db.query(Candidate).filter(Candidate.email == email).first()
    if not candidate:
        candidate = Candidate(
            email=email,
            full_name=full_name,
            phone=phone,
            years_of_experience=years_of_experience
        )
        db.add(candidate)
        db.flush()
    else:
        # Update candidate info
        candidate.full_name = full_name
        candidate.phone = phone or candidate.phone
        candidate.years_of_experience = years_of_experience or candidate.years_of_experience

    # Check if already applied
    existing_app = db.query(Application).filter(
        Application.job_id == job.id,
        Application.candidate_id == candidate.id
    ).first()

    if existing_app:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied for this job"
        )

    # Save resume file
    os.makedirs(settings.upload_dir, exist_ok=True)
    file_uuid = str(uuid.uuid4())
    file_path = os.path.join(settings.upload_dir, f"{file_uuid}.{file_ext}")

    with open(file_path, "wb") as f:
        f.write(content)

    # Parse resume
    resume_data = resume_parser.parse(file_path)

    # Use form years_of_experience if provided, otherwise use parsed value
    if years_of_experience is not None:
        resume_data["years_of_experience"] = years_of_experience

    # Build job data for AI analysis
    job_data = {
        "title": job.title,
        "description": job.description,
        "requirements": job.requirements,
        "skills": job.skills or [],
        "min_experience": job.min_experience
    }

    # Use AI analyzer if available, fallback to rule-based scorer
    if ai_analyzer.is_available() and resume_data.get("raw_text"):
        score_result = ai_analyzer.analyze_resume(resume_data["raw_text"], job_data)
        # Update resume_data with AI-extracted experience if not provided
        if years_of_experience is None and score_result.get("years_of_experience"):
            resume_data["years_of_experience"] = score_result["years_of_experience"]
    else:
        score_result = scorer.score(resume_data, job_data)

    # Build full score breakdown with all AI analysis data
    full_score_breakdown = {
        **score_result.get("score_breakdown", {}),
        "matched_skills": score_result.get("matched_skills", []),
        "missing_skills": score_result.get("missing_skills", []),
        "strengths": score_result.get("strengths", []),
        "concerns": score_result.get("concerns", []),
        "ai_powered": score_result.get("ai_powered", False)
    }

    # Create application
    application = Application(
        job_id=job.id,
        candidate_id=candidate.id,
        resume_path=file_path,
        resume_parsed=resume_data,
        ai_score=score_result["final_score"],
        score_breakdown=full_score_breakdown,
        explanation=score_result["explanation"]
    )
    db.add(application)
    db.commit()

    return ApplicationSubmitResponse(
        message="Application submitted successfully",
        application_id=application.id
    )


# Protected endpoints (auth required)

@router.get("/jobs/{job_id}/applications", response_model=ApplicationListResponse)
def list_applications(
    job_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: Optional[str] = None,
    sort_by: str = "score"
):
    """List all applications for a job (sorted by AI score)"""
    # Verify job belongs to user
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    query = db.query(Application).filter(Application.job_id == job_id)

    if status:
        query = query.filter(Application.status == status)

    # Sort by score (descending) by default
    if sort_by == "score":
        query = query.order_by(desc(Application.ai_score))
    elif sort_by == "date":
        query = query.order_by(desc(Application.applied_at))

    applications = query.all()

    # Build response
    app_responses = []
    for app in applications:
        candidate = app.candidate
        app_responses.append(ApplicationResponse(
            id=app.id,
            candidate=CandidateInfo(
                id=candidate.id,
                full_name=candidate.full_name,
                email=candidate.email,
                phone=candidate.phone,
                years_of_experience=candidate.years_of_experience
            ),
            ai_score=app.ai_score,
            score_breakdown=app.score_breakdown,
            explanation=app.explanation,
            status=app.status,
            applied_at=app.applied_at,
            resume_path=app.resume_path
        ))

    return ApplicationListResponse(applications=app_responses, total=len(app_responses))


@router.get("/applications/{application_id}", response_model=ApplicationDetailResponse)
def get_application(
    application_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific application with full details"""
    application = db.query(Application).filter(Application.id == application_id).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    # Verify job belongs to user
    job = db.query(Job).filter(
        Job.id == application.job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    candidate = application.candidate

    # Extract matched/missing skills from score_breakdown if available
    score_data = application.score_breakdown or {}
    matched_skills = score_data.get("matched_skills", [])
    missing_skills = score_data.get("missing_skills", [])
    strengths = score_data.get("strengths", [])
    concerns = score_data.get("concerns", [])

    return ApplicationDetailResponse(
        id=application.id,
        candidate=CandidateInfo(
            id=candidate.id,
            full_name=candidate.full_name,
            email=candidate.email,
            phone=candidate.phone,
            years_of_experience=candidate.years_of_experience
        ),
        ai_score=application.ai_score,
        score_breakdown=application.score_breakdown,
        explanation=application.explanation,
        status=application.status,
        applied_at=application.applied_at,
        resume_path=application.resume_path,
        resume_parsed=application.resume_parsed,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        strengths=strengths,
        concerns=concerns,
        notes=application.notes
    )


@router.put("/applications/{application_id}/notes")
def update_application_notes(
    application_id: UUID,
    note_data: ApplicationNoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update notes for an application"""
    application = db.query(Application).filter(Application.id == application_id).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    # Verify job belongs to user
    job = db.query(Job).filter(
        Job.id == application.job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    application.notes = note_data.note
    db.commit()

    return {"message": "Notes updated successfully"}


@router.post("/applications/{application_id}/action")
def application_action(
    application_id: UUID,
    action_data: ApplicationAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Take action on an application (interview, reject, hire)"""
    application = db.query(Application).filter(Application.id == application_id).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    # Verify job belongs to user
    job = db.query(Job).filter(
        Job.id == application.job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    valid_actions = ["interview", "reject", "hire", "reviewed"]
    if action_data.action not in valid_actions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid action. Valid actions: {', '.join(valid_actions)}"
        )

    application.status = action_data.action
    db.commit()

    return {"message": f"Application marked as {action_data.action}"}


@router.get("/applications/{application_id}/resume")
def download_resume(
    application_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Download resume file for an application"""
    application = db.query(Application).filter(Application.id == application_id).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    # Verify job belongs to user
    job = db.query(Job).filter(
        Job.id == application.job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    # Check if file exists
    if not application.resume_path or not os.path.exists(application.resume_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume file not found"
        )

    # Get candidate name for filename
    candidate = application.candidate
    filename = f"{candidate.full_name.replace(' ', '_')}_resume{os.path.splitext(application.resume_path)[1]}"

    return FileResponse(
        path=application.resume_path,
        filename=filename,
        media_type="application/octet-stream"
    )
