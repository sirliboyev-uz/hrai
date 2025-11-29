# MVP PRODUCT REQUIREMENTS DOCUMENT (PRD)
## HR AI - AI-Powered Resume Screening Platform

**Framework**: BMAD (MVP Phase Only)
**Version**: 1.0
**Status**: READY FOR DEVELOPMENT
**Timeline**: 6-8 weeks
**Team Size**: 2-3 people

---

## 1. EXECUTIVE SUMMARY

### One Sentence Product Definition
**HR AI** is a web platform where HR managers create a job posting, get a shareable link, candidates apply with resumes, and the AI automatically ranks them by match quality.

### The Core Problem
HR managers spend 5-10 hours per job manually screening resumes. They need a faster way to identify top candidates without leaving their platform.

### MVP Scope (6-8 weeks)
- HR creates job
- System generates public link
- Candidates apply (resume + info)
- AI parses resume & ranks candidates
- HR reviews ranked list + sends interview/rejection

### What's NOT in MVP
❌ Video interviews
❌ Team collaboration/comments
❌ Analytics dashboards
❌ HRIS integrations
❌ Fairness audits
❌ Multi-language (English only for MVP)
❌ Mobile app
❌ Advanced filtering

### Success Criteria
✅ 50+ jobs created within 3 months
✅ 85%+ ranking accuracy (vs. HR manual decisions)
✅ <2 second ranking time
✅ 10+ paying customers
✅ NPS >40

---

## 2. BUSINESS REQUIREMENTS

### Revenue Model (Simple)
```
FREE:        5 jobs, 50 candidates/month
$99/month:   25 jobs, 500 candidates/month
$299/month:  Unlimited jobs, unlimited candidates
```

### Target Customer
Small-medium tech/finance companies (50-300 employees) in Uzbekistan & Central Asia who:
- Hire developers, product managers, designers
- Currently use manual resume screening
- Can't afford Workday ($500K+/year)
- Need faster hiring process

### Go-to-Market
Month 1-2: 10-15 direct beta users (founder outreach)
Month 3: Public launch with 5-10 paying customers target
Month 6: 50+ active jobs, $5K MRR

---

## 3. USER FLOWS (CORE ONLY)

### Flow 1: HR Creates Job & Gets Link

```
HR Manager opens app
    ↓
[Login with email/password] (simple auth)
    ↓
Dashboard shows: "Create New Job"
    ↓
Fill Job Form:
  • Job title (required): "Senior Python Engineer"
  • Description (required): [Rich text editor or plain text]
  • Requirements (required): [Plain text, bullet points]
  • Required skills: [Multi-select dropdown: Python, Django, AWS, etc.]
  • Minimum experience: [Dropdown: 1, 2, 3, 5, 7+ years]
    ↓
[Publish Job] button
    ↓
SUCCESS: Job published!
Shows: "Your job link: myhr.ai/jobs/abc123"
Option to: [Copy Link] [QR Code] [Share on LinkedIn]
    ↓
END
```

### Flow 2: Candidate Applies

```
Candidate clicks job link (myhr.ai/jobs/abc123)
    ↓
[No login required - see job details]
Shows:
  • Company name
  • Job title
  • Description
  • Requirements
  • Required skills
    ↓
[Apply Now] button
    ↓
Application Form (required fields only):
  • Full name: [text input]
  • Email: [email input]
  • Phone: [phone input]
  • Resume: [drag-drop upload]
  • Years of experience: [number input]
  • Current company: [text input, optional]
    ↓
[Submit Application] button
    ↓
Confirmation Page:
"Thank you for applying!
 We'll review your application and get back to you."
    ↓
Email sent to candidate: "We received your application"
    ↓
END
```

### Flow 3: AI Scores Resume

```
Backend process (triggered on application submit):
    ↓
Resume Parser:
  • Extract: name, email, phone, years of exp, skills, work history
  • Input: candidate resume (PDF/DOCX)
  • Output: structured JSON
  • Accuracy target: 80%+
    ↓
Job Requirement Parser:
  • Extract: required skills, years of exp, education
  • Input: job description + requirements
  • Output: structured JSON
    ↓
Semantic Matching:
  • Compare: candidate skills vs job requirements
  • Score: 0-100 (how well they match)
  • Logic:
    - Skills match (40% weight): 85%
    - Experience match (60% weight): 90%
    - Final score: (85 × 0.4) + (90 × 0.6) = 88
    ↓
Store in database:
  • applications table
  • score: 88
  • score_breakdown: {"skills": 85, "experience": 90}
    ↓
HR dashboard updated in real-time (candidates list refreshes)
    ↓
END
```

### Flow 4: HR Reviews Ranked Candidates

```
HR Manager opens job details page
    ↓
Sees list of ALL candidates for this job:
  Sorted by: AI Score (highest → lowest)

  [Display Format]
  1. John Smith          88/100  Applied 2 hours ago
     Skills: Python ✓, Django ✓, AWS ✗
     Experience: 7 years (need 5+) ✓
     [View] [Interview] [Reject]

  2. Sarah Johnson       76/100  Applied 5 hours ago
     Skills: Python ✓, Django ✗, AWS ✓
     Experience: 4 years (need 5+) ✗
     [View] [Interview] [Reject]

  3. Mike Chen           65/100  Applied 1 day ago
     [View] [Interview] [Reject]
    ↓
HR clicks candidate name → Sees:
  • Full resume (embedded PDF)
  • Extracted info (name, email, phone, exp, skills)
  • Score breakdown with explanation
  • Current company, years of experience
    ↓
HR clicks [Interview] → Email form:
  "Default: Hi {name}, we'd like to schedule an interview..."
  [Customize] [Send]
    ↓
Email sent to candidate: "You're invited to interview!"
Application status changes to: "Interview Requested"
    ↓
OR: HR clicks [Reject] → Email form:
  "Default: Thank you for applying, but we're moving forward..."
  [Customize] [Send]
    ↓
Email sent to candidate: "Your application status"
Application status changes to: "Rejected"
    ↓
END
```

---

## 4. FUNCTIONAL REQUIREMENTS (MVP ONLY)

### HR Side Features

| Feature | Description | Must-Have |
|---------|-------------|-----------|
| **User Registration** | Email + password signup | YES |
| **User Login** | Email + password authentication | YES |
| **Create Job** | Form: title, description, requirements, skills, experience | YES |
| **Publish Job** | Generate public link (myhr.ai/jobs/{id}) | YES |
| **View Jobs List** | HR sees all their jobs | YES |
| **View Applications** | See all candidates for a job, ranked by AI score | YES |
| **View Candidate Profile** | See resume, extracted info, score breakdown | YES |
| **Send Interview Email** | Send interview request (template + custom) | YES |
| **Send Rejection Email** | Send rejection (template + custom) | YES |
| **Delete Job** | Close/archive job | NO (v2) |
| **Edit Job** | Modify job description | NO (v2) |
| **Analytics** | Job metrics, time to hire | NO (v2) |
| **Team Members** | Invite others | NO (v2) |

### Candidate Side Features

| Feature | Description | Must-Have |
|---------|-------------|-----------|
| **Browse Public Jobs** | See job listing (no login) | YES |
| **View Job Details** | See full job info (no login) | YES |
| **Apply for Job** | Submit resume + form (no login required) | YES |
| **Application Confirmation** | See success message + confirmation email | YES |
| **Track Status** | Login to see application status | NO (v2) |
| **Update Resume** | Upload new resume | NO (v2) |

### AI/ML Features

| Feature | Description | Must-Have |
|---------|-------------|-----------|
| **Resume Parser** | Extract: name, email, phone, exp, skills, work history | YES |
| **Job Parser** | Extract requirements from job description | YES |
| **Semantic Matching** | Calculate match score (0-100) | YES |
| **Ranking** | Sort candidates by score | YES |
| **Score Explanation** | Show why candidate got score X | YES |

### Admin/System Features

| Feature | Description | Must-Have |
|---------|-------------|-----------|
| **Basic Auth** | JWT tokens, password reset | YES |
| **Email Service** | Send emails (interview request, rejection, confirmation) | YES |
| **Database** | Store jobs, applications, scores | YES |
| **Error Handling** | Graceful error messages | YES |

---

## 5. NON-FUNCTIONAL REQUIREMENTS (MVP)

### Performance
- **Resume parsing**: <30 seconds
- **Candidate ranking**: <2 seconds (for 100 candidates)
- **Page load time**: <3 seconds
- **API response**: <1 second

### Scalability
- Support 100+ jobs
- Support 5,000+ applications
- Support 50 concurrent HR users
- Support 100 concurrent applicants

### Security (Basic MVP)
- HTTPS only
- JWT authentication
- Password requirements (8+ chars)
- Store passwords hashed (bcrypt)
- Basic audit logging

### Data Privacy
- Comply with GDPR (candidate data deletion)
- Private job links (only shared candidates can apply)
- No selling candidate data
- Clear privacy policy

### Reliability
- 95% uptime (not 99.5% - MVP is okay with downtime)
- Daily backups
- Graceful error handling

### Usability
- Simple, 5-minute setup for HR
- Responsive design (desktop + tablet)
- English language only (MVP)
- No training needed

---

## 6. USER STORIES (MVP ONLY - 10 Total)

### Epic 1: Job Creation & Publishing

**Story 1: Create Job**
```
As an HR manager,
I want to create a new job posting,
So that I can start receiving applications.

Acceptance Criteria:
✓ Form has: title, description, requirements, skills, min experience
✓ All fields required
✓ Can preview job before publishing
✓ Publish generates public link (myhr.ai/jobs/{id})
✓ Can share link via copy/QR/email
✓ Success message shows the link
✓ Job appears on public jobs page
```

**Story 2: View My Jobs**
```
As an HR manager,
I want to see all jobs I've created,
So that I can manage them.

Acceptance Criteria:
✓ Dashboard lists all my jobs
✓ Show: title, status, # of applications, created date
✓ Click job to see all applicants
✓ Can click to close/archive job (simple version)
```

---

### Epic 2: Candidate Application

**Story 3: Browse Public Jobs**
```
As a candidate,
I want to see open job listings,
So that I can find jobs to apply for.

Acceptance Criteria:
✓ Public page lists all open jobs
✓ Show: title, company, location
✓ No login required
✓ Click job to see details
✓ Simple grid or list view
```

**Story 4: View Job & Apply**
```
As a candidate,
I want to see full job details and submit my resume,
So that I can apply.

Acceptance Criteria:
✓ See job description, requirements, skills, experience needed
✓ [Apply Now] button opens application form
✓ Form fields: name, email, phone, resume, years exp, company
✓ Resume upload (drag-drop or file picker)
✓ Submit button validates required fields
✓ Success page: "Thank you for applying!"
✓ Confirmation email sent to candidate
```

**Story 5: Receive Application Confirmation**
```
As a candidate,
I want to receive an email confirming my application,
So that I know it was received.

Acceptance Criteria:
✓ Email sent immediately after submission
✓ Email includes: job title, application date, next steps
✓ Email is branded with company name/logo
✓ Cannot directly reply (one-way email)
```

---

### Epic 3: AI Scoring

**Story 6: Parse Resume & Extract Data**
```
As the AI system,
I want to extract structured data from resume,
So that I can match it with job requirements.

Acceptance Criteria:
✓ Support: PDF, DOCX formats
✓ Extract: name, email, phone, location, years of exp, skills, work history
✓ 80%+ accuracy on standard resumes
✓ <30 seconds parsing time
✓ Fallback: Manual data entry form for unparseable resumes
✓ Log all parsing errors for debugging
```

**Story 7: Calculate Match Score**
```
As the AI system,
I want to score how well a candidate matches the job,
So that I can rank candidates.

Acceptance Criteria:
✓ Input: parsed resume + parsed job requirements
✓ Calculate: skills match (40% weight) + experience match (60% weight)
✓ Output: score 0-100
✓ Output: score breakdown {skills: X, experience: Y}
✓ <2 seconds to score 100 candidates
✓ Score explanation: "Matched: Python, Django; Missing: AWS"
✓ Store score in database
```

---

### Epic 4: HR Reviews Candidates

**Story 8: View Ranked Candidate List**
```
As an HR manager,
I want to see all applicants ranked by AI score,
So that I can focus on best matches first.

Acceptance Criteria:
✓ Dashboard shows all candidates for a job
✓ Sorted: highest score first
✓ Show: name, score, applied date, score breakdown
✓ Load <2 seconds
✓ Click candidate to see full profile
```

**Story 9: View Candidate Profile & Score Explanation**
```
As an HR manager,
I want to see why a candidate got a specific score,
So that I can trust the AI.

Acceptance Criteria:
✓ Show full resume (PDF embedded or link)
✓ Show extracted data (name, email, phone, exp, skills)
✓ Show score: "John: 88/100"
✓ Show breakdown: "Skills: 85 (Python ✓, Django ✓, AWS ✗)"
✓                 "Experience: 90 (7 years, need 5+)"
✓ Show what's missing: "Missing: AWS, Docker"
✓ Show what's extra: "Has: GCP (transferable to AWS)"
✓ Human-readable explanation in plain language
```

**Story 10: Send Interview Request or Rejection**
```
As an HR manager,
I want to send interview request or rejection to candidate,
So that I can move forward or close the loop.

Acceptance Criteria:
✓ Two buttons: [Interview Request] [Reject]
✓ [Interview Request] opens pre-filled email:
  - Default text: "Hi {name}, we'd like to interview you..."
  - HR can customize message
  - [Send] button
  - Email sent to candidate
  - Status changes to "Interview Requested"
✓ [Reject] opens pre-filled email:
  - Default text: "Thank you, but we're moving forward..."
  - HR can customize message
  - [Send] button
  - Email sent to candidate
  - Status changes to "Rejected"
✓ Both emails branded with company info
✓ Both emails are professional and clear
```

---

## 7. DATA MODELS (MINIMAL MVP)

### Database Schema

```sql
-- Users (HR Managers)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    company_name VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    skills JSON, -- ["Python", "Django", "AWS"]
    min_experience INT, -- years
    public_link VARCHAR UNIQUE,
    status ENUM('draft', 'published', 'closed') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Candidates
CREATE TABLE candidates (
    id UUID PRIMARY KEY,
    email VARCHAR NOT NULL,
    phone VARCHAR,
    full_name VARCHAR NOT NULL,
    years_of_experience INT,
    current_company VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Applications (Candidate applies to Job)
CREATE TABLE applications (
    id UUID PRIMARY KEY,
    job_id UUID REFERENCES jobs(id),
    candidate_id UUID REFERENCES candidates(id),

    -- Resume
    resume_path VARCHAR, -- S3 path
    resume_text TEXT, -- extracted text
    resume_json JSON, -- {"skills": ["Python"], "exp": 7, ...}

    -- Scores
    ai_score DECIMAL, -- 0-100
    ai_score_breakdown JSON, -- {"skills": 85, "experience": 90}
    ai_explanation TEXT, -- "Matched: Python, Django. Missing: AWS"

    -- Status
    status ENUM('applied', 'interview_requested', 'rejected') DEFAULT 'applied',

    applied_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(job_id, candidate_id)
);
```

### Resume Parsing Output (Simple)

```json
{
  "full_name": "John Smith",
  "email": "john@email.com",
  "phone": "+1-234-567-8900",
  "years_of_experience": 7,
  "current_company": "Google",
  "skills": ["Python", "Django", "PostgreSQL", "AWS"],
  "work_history": [
    {
      "company": "Google",
      "title": "Senior Engineer",
      "duration": "2020-2023"
    }
  ]
}
```

### AI Scoring Output (Simple)

```json
{
  "final_score": 88,
  "score_breakdown": {
    "skills_match": 85,
    "experience_match": 90
  },
  "explanation": "Strong match: Has Python, Django, 7+ years exp. Missing AWS experience but has similar cloud background."
}
```

---

## 8. TECHNICAL STACK (MINIMAL)

### Frontend
```
React (UI framework)
TypeScript (type safety)
Tailwind CSS (styling)
Axios (API calls)
```

### Backend
```
FastAPI (Python web framework)
PostgreSQL (database)
Redis (caching, job queue)
```

### NLP/ML
```
spaCy (resume parsing, job parsing)
scikit-learn (semantic matching, scoring)
```

### Infrastructure
```
AWS EC2 (server)
AWS S3 (file storage - resumes)
AWS RDS (PostgreSQL database)
Docker (containerization)
```

### Email
```
SendGrid or AWS SES (sending emails)
```

---

## 9. IMPLEMENTATION TIMELINE (6-8 Weeks)

| Week | Focus | Deliverable |
|------|-------|-------------|
| **1** | Setup & Planning | Project structure, git repo, API design |
| **2** | Backend Foundation | User auth, database, job creation API |
| **3** | Resume Parsing | spaCy integration, resume extraction |
| **4** | AI Scoring | Semantic matching, ranking algorithm |
| **5** | Frontend - HR | Dashboard, job creation form, candidate list |
| **6** | Frontend - Candidate | Public job portal, application form |
| **7** | Integration & Polish | Connect front-end to back-end, bug fixes |
| **8** | Testing & Deploy | QA, production deployment, launch |

---

## 10. SUCCESS CRITERIA (MUST MEET FOR MVP LAUNCH)

### Product Quality
- ✅ Resume parsing works 80%+ of the time
- ✅ AI scoring accuracy 85%+ (vs. HR manual ranking)
- ✅ <2 second ranking time
- ✅ Zero critical bugs in production

### Business Traction
- ✅ 50+ jobs created by users
- ✅ 10+ paying customers signed up
- ✅ $1-2K MRR

### User Satisfaction
- ✅ NPS >40
- ✅ 90%+ of users complete first job posting
- ✅ <5% churn rate

### Technical Performance
- ✅ 99% uptime
- ✅ <3 second page loads
- ✅ <30 second resume parsing

---

## 11. WHAT'S NOT IN MVP (Post-MVP Features)

These will be in **v1.1, v2.0, etc.**:

```
❌ Video interviews
❌ Team collaboration (comments, mentions)
❌ Advanced filtering/sorting
❌ Analytics dashboards
❌ Fairness audit reports
❌ HRIS integrations (Workday, etc.)
❌ Multi-post to job boards
❌ Calendar/scheduling integration
❌ Uzbek language support
❌ Mobile app
❌ Advanced candidate profile
❌ Bulk operations
❌ Custom branding per company
```

---

## 12. RISKS (MVP FOCUSED)

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Resume parsing fails** | High | Test with 200+ real resumes, manual fallback form |
| **AI scoring inaccurate** | High | Compare AI vs HR decisions, retrain if needed |
| **Slow ranking** | Medium | Profile code, optimize SQL queries, use caching |
| **Users don't adopt** | High | 5-min onboarding, free tier, direct support |
| **Email delivery fails** | Medium | Use reliable vendor (SendGrid), test thoroughly |

---

## 13. DEFINITION OF DONE

MVP is **DONE** when:

✅ HR can create job → get link → share
✅ Candidates can apply with resume
✅ System parses resume (80%+ success)
✅ System scores candidates (85%+ accuracy)
✅ HR sees ranked list with explanations
✅ HR can send interview request/rejection emails
✅ 50+ jobs created
✅ 10+ paying customers
✅ NPS >40
✅ Zero critical bugs
✅ Deployed to production

---

## APPENDIX: USER FLOW DIAGRAMS

### Complete User Journey

```
┌─────────────────────────────────────────────────────────┐
│                    START                                │
└────────────────────┬────────────────────────────────────┘
                     ↓
        ┌────────────────────────┐
        │  HR SIDE               │  CANDIDATE SIDE
        └────────────────────────┘
                ↓                          ↓
        ┌──────────────────┐      ┌──────────────────┐
        │ 1. Create Job    │      │ 1. View Jobs     │
        │    (form)        │      │    (no login)    │
        └────────┬─────────┘      └────────┬─────────┘
                 ↓                         ↓
        ┌──────────────────┐      ┌──────────────────┐
        │ 2. Publish       │      │ 2. View Details  │
        │    (get link)    │      │    (click job)   │
        └────────┬─────────┘      └────────┬─────────┘
                 ↓                         ↓
        ┌──────────────────┐      ┌──────────────────┐
        │ 3. Share Link    │      │ 3. Apply         │
        │    (copy/QR)     │      │    (fill form +  │
        └────────┬─────────┘      │     upload)      │
                 ↓                └────────┬─────────┘
                 │                         ↓
                 │                ┌──────────────────┐
                 └───────────────→│ 4. AI Scores     │
                                  │    (parse +      │
                                  │     rank)        │
                                  └────────┬─────────┘
                                           ↓
        ┌──────────────────────────────────────────┐
        │ 5. Ranked List (HR sees candidates)      │
        └────────┬─────────────────────────────────┘
                 ↓
        ┌──────────────────┐
        │ 6. HR Action     │
        │ [Interview]      │
        │ [Reject]         │
        └────────┬─────────┘
                 ↓
        ┌──────────────────────────────────────────┐
        │ 7. Email sent to candidate               │
        └────────────────────────────────────────┘
```

---

## SUMMARY

This MVP PRD defines a **minimal, focused product** that:

✅ Can be built in 6-8 weeks
✅ Solves one core problem (resume screening)
✅ Has 10 user stories (not 50)
✅ Has 10 core features (not 50)
✅ Flow-based (HR → Job → Candidate → Application → Score → Review)
✅ No bloat, no premature features
✅ Ready for development

**Next Steps**:
1. Review this MVP PRD with team
2. Move to Architecture Design phase
3. Start sprint planning

---

