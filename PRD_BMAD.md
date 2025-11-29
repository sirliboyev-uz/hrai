# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## HR AI - AI-Powered Recruitment Platform

**BMAD Framework: Planning Phase**
**Document Version**: 1.0
**Last Updated**: 2025-11-29
**Status**: DRAFT → READY FOR REVIEW

---

## EXECUTIVE SUMMARY

### Product Vision
**HR AI** is an AI-powered recruitment platform that automates candidate screening, ranking, and matching for HR teams. Using natural language processing and machine learning, HR managers create job postings and receive automatically ranked candidate lists, saving 70% of screening time while improving hiring quality.

### Problem Statement
- HR teams spend 5-10 hours per job opening manually reviewing resumes
- 40% of qualified candidates are missed due to human bias or keyword misses
- Current ATS platforms (Workday, SuccessFactors) are expensive ($500K+/year), complex, and have limited Uzbek language support
- Small-to-medium enterprises (SMEs) lack access to intelligent recruitment tools

### Target Market
- **Primary**: SMEs (50-500 employees) in Uzbekistan and Central Asia
- **Secondary**: Large enterprises needing recruitment module replacement
- **Tertiary**: Recruitment agencies managing multiple job openings

### Success Criteria (MVP)
- 50+ active jobs within 3 months
- 85%+ accuracy in candidate ranking (vs. manual HR decision)
- 70% reduction in resume screening time
- NPS > 40 from beta users
- <2s response time for AI scoring

---

## 1. BUSINESS REQUIREMENTS

### 1.1 Business Goals

| Goal | Metric | Target | Timeline |
|------|--------|--------|----------|
| **Market Entry** | Jobs created | 50+ | 3 months |
| **User Adoption** | Active HR managers | 25+ | 3 months |
| **Product Quality** | Ranking accuracy | 85%+ | MVP launch |
| **Performance** | API response time | <2 seconds | MVP launch |
| **User Satisfaction** | NPS Score | >40 | 6 months |
| **Revenue** | MRR (Monthly Recurring Revenue) | $5K-10K | 6 months |

### 1.2 Revenue Model

**Freemium Tier**
- Price: FREE
- Includes: 5 job postings, 50 applicants/month
- Purpose: User acquisition, market validation

**Professional Tier**
- Price: $299/month
- Includes: Unlimited jobs, 500 applicants/month, basic analytics, email support
- Target: 20-50 customers (months 1-6)

**Enterprise Tier**
- Price: $999/month
- Includes: All Professional + API access, HRIS integrations, dedicated support, custom training
- Target: 3-5 customers (months 6-12)

**Projected MRR Growth**
- Month 1-2: $1K (5 paying customers)
- Month 3-4: $5K (15 paying customers)
- Month 6: $10K (30 paying customers)
- Month 12: $30K+ (50+ paying customers)

### 1.3 Competitive Landscape

| Competitor | Strengths | Weaknesses | Our Advantage |
|------------|-----------|-----------|--------------|
| **Greenhouse** | Feature-rich, large market | Expensive ($500K+), complex | Uzbek localization, 10x cheaper |
| **Lever** | Modern UI, good mobile | $$$, global focus | Uzbek-first, local support |
| **Workday** | Integrated HRIS | Massive overkill for SMEs | Simple, focused tool |
| **Local solutions** | Localized | Limited AI, poor UX | Advanced AI, better UI |

**Our Competitive Advantage**: Uzbek language support + affordable pricing + AI-first approach

### 1.4 Go-to-Market Strategy

**Phase 1: Private Beta (Weeks 1-4)**
- Target: 10-15 HR managers from tech/finance companies
- Method: Direct outreach, founder relationships
- Goal: Gather feedback, improve accuracy

**Phase 2: Public Beta (Weeks 5-8)**
- Target: 50+ HR managers across industries
- Method: LinkedIn, HR communities, job boards
- Goal: Validate product-market fit

**Phase 3: Official Launch (Month 3)**
- Target: 100+ companies signed up
- Method: Paid ads, partnerships, content marketing
- Goal: Establish market presence

---

## 2. MARKET ANALYSIS

### 2.1 Market Size & Opportunity

**Uzbekistan Tech Market:**
- ICT services grew 120%+ in 2024
- IT exports: €312 million (2024)
- AI strategy: $1.5 billion market target by 2030
- Tech companies: 2,000+ in IT Park Tashkent
- Hiring growth: 40% YoY in tech sector

**Central Asia Market:**
- 5 countries: Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan
- Total TAM: ~$500M annually for recruitment software
- SAM (Serviceable Market): ~$50M for AI recruitment tools
- SOM (Serviceable Obtainable Market): $5M by 2030

### 2.2 User Personas

**Persona 1: Busy HR Manager**
- Name: Dilshod (35)
- Company: Tech startup (50 employees)
- Pain: Spends 6 hours/week reviewing resumes manually
- Goal: Reduce screening time, hire faster
- Adoption: High (if saves time)

**Persona 2: Recruitment Agency Owner**
- Name: Gulnara (42)
- Company: Staffing agency (10 recruiters)
- Pain: Managing multiple jobs, candidates scattered
- Goal: Scale hiring without hiring more recruiters
- Adoption: Medium (needs training)

**Persona 3: Enterprise HR Lead**
- Name: Aziz (48)
- Company: Large corporation (500+ employees)
- Pain: Expensive HRIS, limited Uzbek support
- Goal: Replace/complement existing system
- Adoption: Medium (needs integration)

### 2.3 Market Trends

✅ **AI adoption in HR**: 60% of HR leaders consider AI top priority (2025)
✅ **Remote work growth**: 70% of tech jobs are remote, enabling remote hiring
✅ **Uzbek tech boom**: Government investing in AI infrastructure, partnerships with NVIDIA
✅ **Cost pressure**: SMEs looking for affordable alternatives to Workday
✅ **Localization demand**: Limited recruitment software in Uzbek language

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Core Features by User Type

#### **A. HR MANAGER FEATURES**

**FR-1: Job Creation & Management**
- Create job posting with title, description, requirements
- Define required skills with proficiency levels
- Set minimum experience requirements
- Set salary range (optional, for candidate visibility)
- Define custom application questions (0-10)
- Publish/draft/close job status
- Generate public job link (e.g., myhr.ai/jobs/123)
- Generate QR code for easy sharing
- View job metrics (applications, views, CTR)

**FR-2: Candidate Dashboard**
- View all applications ranked by AI score
- Filter candidates by: score range, location, experience, skills
- Sort by: newest, highest score, recent activity
- Search candidates by name/email
- View candidate profile (resume, answers, contact info)
- Download resume in original format

**FR-3: Candidate Actions**
- Send interview request email
- Send rejection with custom message
- Add candidate to "shortlist"
- Add internal notes/comments
- Change application status (applied → reviewing → shortlisted → rejected/hired)
- Tag candidates with custom labels

**FR-4: Analytics & Reporting**
- Job performance dashboard (views, applications, conversion rates)
- Candidate quality metrics (average score, score distribution)
- Time-to-hire tracking
- Funnel analytics (applications → interviews → hired)
- Export reports as PDF/CSV
- Email digest (weekly summary)

**FR-5: Team Collaboration**
- Invite team members (HR, hiring managers, C-level)
- Role-based permissions (viewer, editor, admin)
- Comments on candidates (internal discussion)
- Activity feed (who did what, when)

**FR-6: Settings & Integration**
- Company profile (logo, description, branding)
- Email configuration (from name, signature)
- API access (for HRIS integration)
- Webhook setup (for third-party services)
- Team member management

---

#### **B. CANDIDATE FEATURES**

**FR-7: Public Job Portal**
- Browse job listings by company
- Search jobs by title, location, skills
- View job details (description, requirements, salary, team info)
- Click "Apply Now" button

**FR-8: Application Form**
- Required fields: Full name, email, phone
- Resume upload (PDF, DOCX, TXT)
- Cover letter upload (optional)
- Answer custom application questions
- Years of experience selector
- Skills multi-select (auto-populated from job)
- Availability date selector
- Salary expectation input (optional)
- Video introduction upload (optional, 30-60 sec)

**FR-9: Application Status Tracking**
- View application status (applied, reviewing, shortlisted, rejected, offered)
- Receive email notifications on status changes
- Download acceptance/rejection letter as PDF

**FR-10: Candidate Profile (Optional Account)**
- Create account to save profile
- View application history across jobs
- Update resume and info anytime
- Quick-apply to similar jobs

---

#### **C. ADMIN FEATURES**

**FR-11: System Administration**
- View all companies and jobs
- Monitor system health and analytics
- Manage feature flags for A/B testing
- View user feedback and support tickets
- Access audit logs (all changes, who did what)

**FR-12: Data Management**
- Export all data (jobs, candidates, applications)
- Delete candidate data (GDPR compliance)
- Archive old jobs
- Database backups

---

### 3.2 AI/ML Requirements

**FR-13: Resume Parsing**
- Extract structured data from resume:
  - Name, email, phone, location
  - Work experience (company, title, dates)
  - Education (school, degree, graduation date)
  - Skills and technologies
  - Certifications and languages
- Support formats: PDF, DOCX, TXT
- Minimum accuracy: 80% on standard resumes
- Fallback: Manual data entry form for edge cases

**FR-14: Job Requirement Analysis**
- Parse job description and extract:
  - Required skills (hard skills)
  - Nice-to-have skills
  - Minimum experience required
  - Education requirements
  - Preferred qualifications
- Normalize skill names (Python = Python3 = Py)
- Handle synonyms (JS = JavaScript, NodeJS)

**FR-15: Semantic Matching & Scoring**
- Compare candidate resume vs job requirements
- Calculate individual scores for:
  - Skills match (0-100): How well candidate's skills match job requirements
  - Experience match (0-100): Years of relevant experience
  - Education match (0-100): Degree alignment
  - Custom answers (0-100): Quality of written answers
- Apply weighted scoring:
  - Skills: 40% weight
  - Experience: 35% weight
  - Education: 15% weight
  - Custom answers: 10% weight
- Output: Final score 0-100 + breakdown JSON

**FR-16: Ranking & Sorting**
- Rank all candidates for a job by AI score (highest → lowest)
- Rerank in real-time as new applications arrive
- Maintain sorting consistency (no jumping scores)
- Show score explanations (which skills matched, which missed)

**FR-17: Fairness & Bias Detection**
- Log all scoring decisions in audit trail
- Track protected attributes (age, gender, origin if provided)
- Monitor for disparate impact across groups
- Flag suspicious patterns (e.g., 100% rejection of one group)
- Report: Fairness metrics dashboard

**FR-18: Explainability**
- For every score, show:
  - "Skills matched: Python ✓, Django ✓, AWS ✗"
  - "Experience: Candidate has 7 years, job requires 5+ ✓"
  - "Education: Candidate has B.S. Computer Science, job prefers M.S. (partial match)"
- Show what candidate has that job didn't require
- Show what candidate is missing

---

### 3.3 Integration Requirements

**FR-19: Email Notifications**
- Candidate receives: "We got your application" email
- Candidate receives: Status update (interview request, rejection, offer)
- HR receives: New application notification
- HR receives: Candidate commented/messaged
- Admin receives: System alerts (errors, high load)
- All emails customizable with company branding

**FR-20: Third-party Integrations**
- Multi-post feature: Post job to LinkedIn, Indeed, job boards (planned for v2)
- HRIS integration: Send hired candidates to Workday/SuccessFactors (v2)
- Calendar integration: Schedule interviews with Calendly/Google Calendar (v2)
- Slack notification: Send candidate alerts to Slack channel (v2)

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### 4.1 Performance Requirements

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| **API Response Time** | <1 second (p95) | Latency monitoring |
| **Resume Parsing Time** | <30 seconds | Per file timing |
| **Candidate Ranking Time** | <2 seconds for 100 candidates | Batch processing |
| **Page Load Time** | <2 seconds | Lighthouse, real user monitoring |
| **Database Query Time** | <100ms (p95) | Query analysis |
| **Concurrent Users** | 1,000+ simultaneous | Load testing |
| **Monthly Uptime** | 99.5% | Monitoring dashboard |

### 4.2 Scalability Requirements

- **Data Scale**: Support 100,000+ applications/month
- **User Scale**: Support 1,000+ concurrent HR managers
- **Job Scale**: Support 10,000+ concurrent open jobs
- **File Scale**: Handle resumes up to 20MB, 100 uploads/minute
- **Growth**: Support 10x growth without architecture changes

### 4.3 Security Requirements

**Authentication & Authorization**
- JWT token-based authentication
- OAuth 2.0 support (Google, LinkedIn login)
- Password requirements: 12+ chars, complexity rules
- Session timeout: 30 minutes of inactivity
- Role-based access control (RBAC)

**Data Protection**
- HTTPS/TLS 1.2+ for all communications
- AES-256 encryption for data at rest
- PII encryption (names, emails, phone numbers)
- Database encryption
- Regular security audits (quarterly)

**Compliance**
- GDPR compliance (candidate data deletion, consent)
- Data residency: Store data in EU/local servers (not US)
- Audit logs: All actions logged with timestamp, user, change details
- CCPA compliance (US users' right to deletion)
- Uzbek data protection laws compliance

**Data Privacy**
- Candidate data accessible only to authorized HR users
- No sharing with third parties without consent
- Clear privacy policy and ToS
- Cookie consent banner

### 4.4 Reliability Requirements

- **Backup Strategy**: Daily automated backups, 30-day retention
- **Disaster Recovery**: Recovery time objective (RTO) <4 hours
- **Failover**: Automatic failover to backup database
- **Monitoring**: 24/7 system monitoring, alerting on failures
- **Error Handling**: Graceful degradation, user-friendly error messages

### 4.5 Usability Requirements

- **UI/UX**: Intuitive, zero-training interface
- **Accessibility**: WCAG 2.1 AA compliance (for visually impaired users)
- **Mobile**: Responsive design, works on tablets and phones
- **Localization**: Uzbek, Russian, English language support (MVP: English + basic Uzbek)
- **Onboarding**: 5-minute setup, guided tutorial
- **Documentation**: Help center, video tutorials, API docs

### 4.6 Maintainability Requirements

- **Code Quality**: 80%+ code coverage with unit tests
- **Documentation**: API docs, architecture docs, runbook for operations
- **Logging**: Centralized logging (ELK stack or similar)
- **Monitoring**: CPU, memory, disk, database metrics tracked
- **Alerting**: PagerDuty/similar for critical issues
- **Deployment**: Automated CI/CD pipeline, blue-green deployments

### 4.7 Compliance & Legal

- **Age Gate**: 16+ years old required to create accounts
- **ToS/Privacy**: Clear terms of service, privacy policy
- **Consent**: Explicit consent for data collection
- **Data Deletion**: Candidates can request data deletion (within 30 days)
- **Accessibility**: WCAG 2.1 AA minimum

---

## 5. USER STORIES & EPICS

### 5.1 EPIC 1: Job Management (HR)

**EPIC-1.1: Create and Publish Jobs**
```
Story US-1.1.1: Create New Job Posting
As an HR manager,
I want to create a new job posting by filling a form,
So that I can start collecting applications from candidates.

Acceptance Criteria:
- Form has fields: title, description, requirements, skills, location, salary
- All required fields must be filled before publish
- Success message shows public job link
- HR can preview job as candidate would see it
- Job appears on public job board immediately
- HR receives confirmation email

Story US-1.1.2: Share Job Link
As an HR manager,
I want to easily share the job link on social media and job boards,
So that I can reach more candidates.

Acceptance Criteria:
- Generate shareable link (e.g., myhr.ai/jobs/123)
- Generate QR code (printable)
- One-click copy to clipboard
- Pre-filled social media post templates
- Track link clicks and job views
- View share analytics

Story US-1.1.3: Edit Published Job
As an HR manager,
I want to edit job details after publishing,
So that I can fix errors or update requirements.

Acceptance Criteria:
- Edit all fields except: job ID, creation date
- Show warning if editing open job with applications
- History of changes logged
- Notification sent to candidates if requirements change
- Email alert to HR confirming change
```

**EPIC-1.2: Manage Job Status**
```
Story US-1.2.1: Close Job
As an HR manager,
I want to close a job when position is filled,
So that I stop receiving new applications.

Acceptance Criteria:
- Mark job as "closed"
- Job removed from public job board
- Link still works (shows "position filled")
- Candidates notified job is closed
- Still able to view existing applications
- Option to reopen job later

Story US-1.2.2: Archive Old Jobs
As an HR manager,
I want to archive completed jobs,
So that my dashboard stays clean.

Acceptance Criteria:
- Archive removes job from active list
- Archived jobs accessible in "Archive" section
- Cannot apply to archived jobs
- Can restore archived jobs
- Archived data still searchable
```

---

### 5.2 EPIC 2: Candidate Screening (HR)

**EPIC-2.1: View and Filter Candidates**
```
Story US-2.1.1: View Ranked Candidate List
As an HR manager,
I want to see all applicants ranked by AI score (highest first),
So that I can focus on the best matches.

Acceptance Criteria:
- Candidates ranked 0-100 by score
- Show: Name, score, status, application date
- Show score breakdown: skills%, exp%, education%, custom%
- Search bar to find candidate by name/email
- Filter by: score range, location, experience level
- Sort by: score, date, name
- Pagination (20 per page)
- Load time <2 seconds for 100 candidates

Story US-2.1.2: View Candidate Profile
As an HR manager,
I want to click a candidate to see full details,
So that I can make hiring decisions.

Acceptance Criteria:
- Show all extracted resume data
- Show score breakdown with explanations
- Show answers to custom questions
- Show full resume (PDF embed or download)
- Show contact info (email, phone)
- Show application timestamp
- Show candidate location on map (optional)
- Notes/comments section for team
```

**EPIC-2.2: Take Actions on Candidates**
```
Story US-2.2.1: Send Interview Request
As an HR manager,
I want to send interview request to candidate,
So that I can schedule interviews.

Acceptance Criteria:
- Pre-filled email template
- Customize message before sending
- Attach calendar link (Calendly integration)
- Candidate receives email with "Accept/Decline" buttons
- HR sees candidate's response
- Interview added to HR's calendar if accepted
- Auto-send reminder 1 day before interview

Story US-2.2.2: Reject Candidate
As an HR manager,
I want to send professional rejection to candidate,
So that they know they didn't advance.

Acceptance Criteria:
- Pre-filled rejection template
- Customize message before sending
- Option to give feedback ("lacking experience", etc.)
- Candidate receives rejection email
- Option to save candidate for future roles
- Auto-log rejection in audit trail

Story US-2.2.3: Shortlist Candidate
As an HR manager,
I want to mark candidates as shortlisted,
So that I can track top candidates.

Acceptance Criteria:
- One-click shortlist button
- Starred candidates visible at top of list
- Filter: show only shortlisted
- Add tags/labels to candidates
- Move candidates between lists (shortlist → interview → offer)
- View shortlist summary (count, average score)

Story US-2.2.4: Add Internal Notes
As an HR manager,
I want to add private notes on candidates,
So that my team can collaborate on hiring decisions.

Acceptance Criteria:
- Rich text editor (bold, italic, links)
- @mention team members
- Notes visible only to authorized team members
- Edit/delete own notes
- Timestamp and author visible
- Email notification on @mention
```

**EPIC-2.3: Analytics & Reporting**
```
Story US-2.3.1: View Job Performance Dashboard
As an HR manager,
I want to see metrics on job performance,
So that I can optimize my hiring process.

Acceptance Criteria:
- Display: Total views, applications, conversion rate
- Display: Average candidate score, score distribution (chart)
- Display: Time to hire (posted → offer)
- Display: Top skills in applicant pool
- Filter by date range
- Export as CSV/PDF
- Refresh data real-time or every 1 hour

Story US-2.3.2: View Funnel Analytics
As an HR manager,
I want to see candidate funnel (applied → interviewed → hired),
So that I can identify bottlenecks.

Acceptance Criteria:
- Display funnel chart: Applied (100%) → Interviewed (30%) → Hired (5%)
- Show conversion rate between each stage
- Breakdown by job or time period
- Identify which jobs have best conversion
- See average time in each stage
```

---

### 5.3 EPIC 3: Job Application (Candidate)

**EPIC-3.1: Browse and Apply**
```
Story US-3.1.1: Browse Public Jobs
As a candidate,
I want to browse job listings,
So that I can find opportunities that fit me.

Acceptance Criteria:
- Display all open jobs in grid/list view
- Show job title, company, location, salary (if visible)
- Search by job title, company, location
- Filter by job type, salary range, required experience
- Sort by: newest, most relevant, trending
- Click job to see full details
- No login required to browse

Story US-3.1.2: View Job Details
As a candidate,
I want to see complete job information,
So that I can decide to apply.

Acceptance Criteria:
- Display: job title, description, requirements
- Display: company info, team info, location
- Display: salary range, job type, experience level
- Display: required skills, nice-to-have skills
- Display: application deadline (if set)
- Click "Apply Now" to start application
- Show how many people applied (optional)
- Show estimated time to hire (from job history)

Story US-3.1.3: Submit Application
As a candidate,
I want to fill application form and submit,
So that I apply for the job.

Acceptance Criteria:
- Form fields: Name, email, phone (required)
- Resume upload: PDF, DOCX, TXT (required)
- Cover letter: optional upload
- Answer custom questions (if job has any)
- Experience selector: "Years of experience" dropdown
- Skills checkbox: Select skills from job requirements
- Availability: "When can you start?" dropdown
- Video intro: Optional 30-60 second video
- Salary expectation: Optional
- Checkbox: "I agree to privacy policy"
- Submit button (validate all required fields)
- Success message with application number
- Confirmation email sent to candidate
- Option to check application status later
```

**EPIC-3.2: Application Status**
```
Story US-3.2.1: Track Application Status
As a candidate,
I want to see my application status,
So that I know where I stand.

Acceptance Criteria:
- Login to view applications (email + password)
- View status: Applied, Under Review, Shortlisted, Rejected, Offered
- See timeline: When applied, when status changed
- View all answers and resume submitted
- Option to update resume (new version)
- Receive email notification on status change
- Can withdraw application anytime
- Download job offer letter as PDF (when offered)

Story US-3.2.2: Receive Status Notifications
As a candidate,
I want to receive email updates,
So that I stay informed.

Acceptance Criteria:
- Email sent when application received
- Email sent when status changes
- Email sent when interview requested
- Email sent when rejected
- Email sent when offered
- Option to unsubscribe from notifications
- Clear call-to-action in each email
- Branded with company logo
- Timestamp and clear language
```

---

### 5.4 EPIC 4: AI Scoring & Matching

**EPIC-4.1: Resume Parsing**
```
Story US-4.1.1: Parse Resume and Extract Data
As an AI system,
I want to extract structured data from uploaded resume,
So that data is ready for matching.

Acceptance Criteria:
- Support formats: PDF, DOCX, TXT
- Extract: Name, email, phone, location
- Extract: Work experience (company, title, dates, description)
- Extract: Education (school, degree, graduation date)
- Extract: Skills (technologies, tools)
- Extract: Certifications, languages
- Minimum accuracy: 80% (tested on 100 resumes)
- Fallback: Manual data entry form for failed parses
- Log all parsing errors for debugging
- Handle edge cases: Scanned PDFs (OCR), non-standard formats
```

**EPIC-4.2: Semantic Matching**
```
Story US-4.2.1: Calculate Match Score
As an AI system,
I want to calculate how well candidate matches job,
So that candidates are ranked accurately.

Acceptance Criteria:
- Input: Parsed candidate resume + parsed job requirements
- Calculate: Skills match (required vs candidate's)
- Calculate: Experience match (years of relevant experience)
- Calculate: Education match (degree alignment)
- Calculate: Custom answers quality (if applicable)
- Apply weights: Skills 40%, Exp 35%, Edu 15%, Answers 10%
- Output: Final score 0-100
- Output: Score breakdown (JSON with sub-scores)
- Accuracy target: 85% (compared to HR manual ranking)
- Performance: <2 seconds for 100 candidates

Story US-4.2.2: Show Match Explanation
As an HR manager,
I want to see why a candidate got a specific score,
So that I understand the AI decision.

Acceptance Criteria:
- Show detailed breakdown:
  - "Skills: Python ✓, Django ✓, AWS ✗ (70%)"
  - "Experience: 7 years software eng (target 5+) ✓ (95%)"
  - "Education: B.S. Computer Science (good match) ✓ (80%)"
  - "Answers: Good attention to detail ✓ (85%)"
- Highlight missing skills/experience
- Explain why certain skills match or not (e.g., "AWS ✗ - familiar with GCP instead")
- Color-coded: Green (match), Yellow (partial), Red (missing)
- Format: User-friendly, non-technical language
```

**EPIC-4.3: Fairness & Bias Detection**
```
Story US-4.3.1: Monitor for Algorithmic Bias
As an admin,
I want to detect if AI is biasing against certain groups,
So that hiring is fair.

Acceptance Criteria:
- Collect optional demographics: (name origin, age if provided, gender if provided)
- Detect if scores differ significantly by group:
  - E.g., "Average score for Group A: 75, Group B: 65 → 10 point gap"
- Flag suspicious patterns (e.g., 90% rejection of one group)
- Audit log: All scoring decisions with metadata
- Monthly fairness report for admin
- Alert: If disparate impact detected
- Document: Why differences exist (if justified)
```

---

### 5.5 EPIC 5: Admin & System Management

**EPIC-5.1: User Management**
```
Story US-5.1.1: Manage Team Members
As an HR manager,
I want to invite team members and set permissions,
So that my team can collaborate.

Acceptance Criteria:
- Invite team members by email
- Assign roles: Viewer (read-only), Editor (create/edit), Admin (manage users)
- Revoke access anytime
- See list of team members and their roles
- Audit log: Who accessed what, when
- Email notification on invite
- Team member can accept/decline invite
```

**EPIC-5.2: System Settings**
```
Story US-5.2.1: Configure Company Profile
As an HR manager,
I want to customize company branding,
So that job postings and emails match our brand.

Acceptance Criteria:
- Upload company logo
- Set company name, description
- Set email "from" address and signature
- Upload job template (HTML)
- Customize email templates (rejection, interview request, offer)
- Preview emails before sending
- Test email delivery

Story US-5.2.2: Configure API Access
As an HR manager,
I want to get API keys,
So that I can integrate with my HRIS system.

Acceptance Criteria:
- Generate API key (unique, secure)
- Copy/revoke API keys
- Set API rate limits
- View API documentation
- See API usage (calls/month, endpoints used)
- Test API endpoints
```

---

## 6. DATA MODELS

### 6.1 Core Database Schema

```sql
-- Users (HR Managers)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    company_id UUID REFERENCES companies(id),
    role ENUM('admin', 'hr_manager', 'recruiter') DEFAULT 'hr_manager',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Companies
CREATE TABLE companies (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    logo_url VARCHAR,
    description TEXT,
    industry VARCHAR,
    location VARCHAR,
    website VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    subscription_tier ENUM('freemium', 'professional', 'enterprise') DEFAULT 'freemium',
    max_jobs INT DEFAULT 5,
    max_applicants INT DEFAULT 50
);

-- Jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY,
    company_id UUID REFERENCES companies(id),
    created_by UUID REFERENCES users(id),
    title VARCHAR NOT NULL,
    description TEXT,
    requirements TEXT,
    skills JSON, -- ["Python", "Django", "AWS"] with proficiency
    location VARCHAR,
    salary_min DECIMAL,
    salary_max DECIMAL,
    job_type ENUM('full-time', 'part-time', 'contract') DEFAULT 'full-time',
    experience_min INT, -- minimum years required
    experience_preferred INT,
    education_level ENUM('high_school', 'bachelors', 'masters', 'phd'),
    custom_questions JSON, -- [{"question": "Why are you interested?", "type": "text"}]
    public_link VARCHAR UNIQUE,
    status ENUM('draft', 'published', 'closed', 'archived') DEFAULT 'draft',
    views_count INT DEFAULT 0,
    applications_count INT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    closed_at TIMESTAMP,
    hiring_manager_id UUID REFERENCES users(id)
);

-- Candidates
CREATE TABLE candidates (
    id UUID PRIMARY KEY,
    email VARCHAR NOT NULL,
    phone VARCHAR,
    full_name VARCHAR NOT NULL,
    location VARCHAR,
    current_company VARCHAR,
    user_id UUID REFERENCES users(id), -- optional: if candidate creates account
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Applications (Candidate applies to Job)
CREATE TABLE applications (
    id UUID PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) NOT NULL,
    candidate_id UUID REFERENCES candidates(id) NOT NULL,

    -- Resume Data
    resume_path VARCHAR, -- S3 path
    resume_text TEXT, -- Extracted text for NLP
    resume_parsed_data JSON, -- {"skills": ["Python"], "experience": 7, "education": "B.S."}

    -- Application Data
    cover_letter TEXT,
    custom_answers JSON, -- Answers to job-specific questions
    video_url VARCHAR, -- S3 path to video intro
    salary_expectation DECIMAL,
    availability_date DATE,
    years_of_experience INT,

    -- AI Scoring
    ai_score DECIMAL, -- 0-100
    ai_score_breakdown JSON, -- {"skills": 85, "experience": 92, "education": 80, "custom": 88}
    ai_explanation TEXT, -- Human-readable explanation

    -- Status
    status ENUM('applied', 'reviewing', 'shortlisted', 'rejected', 'offered', 'hired', 'withdrawn') DEFAULT 'applied',

    -- Timestamps
    applied_at TIMESTAMP NOT NULL DEFAULT NOW(),
    scored_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    updated_at TIMESTAMP,

    -- Metadata
    UNIQUE(job_id, candidate_id), -- Can't apply twice
    INDEX idx_job_score (job_id, ai_score),
    INDEX idx_status (status)
);

-- Audit Log
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    application_id UUID REFERENCES applications(id),
    action VARCHAR NOT NULL, -- 'scored', 'rejected', 'interviewed', 'offered', etc.
    performed_by UUID REFERENCES users(id),
    old_value JSON,
    new_value JSON,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Team Members (Collaboration)
CREATE TABLE team_members (
    id UUID PRIMARY KEY,
    company_id UUID REFERENCES companies(id),
    user_id UUID REFERENCES users(id),
    role ENUM('viewer', 'editor', 'admin') DEFAULT 'viewer',
    invited_at TIMESTAMP,
    accepted_at TIMESTAMP,
    UNIQUE(company_id, user_id)
);

-- API Keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY,
    company_id UUID REFERENCES companies(id),
    key_hash VARCHAR UNIQUE NOT NULL,
    name VARCHAR,
    created_at TIMESTAMP,
    last_used TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

### 6.2 Resume Parsing Output Format

```json
{
  "candidate_id": "uuid",
  "parse_status": "success",
  "parse_confidence": 0.92,

  "personal_info": {
    "full_name": "John Smith",
    "email": "john@email.com",
    "phone": "+1-234-567-8900",
    "location": "New York, NY"
  },

  "experience": [
    {
      "company": "Google",
      "title": "Senior Software Engineer",
      "start_date": "2020-01",
      "end_date": "2023-06",
      "duration_years": 3.5,
      "description": "Led team of 5 engineers...",
      "technologies": ["Python", "Google Cloud", "Kubernetes"]
    }
  ],

  "education": [
    {
      "school": "UC Berkeley",
      "degree": "B.S.",
      "field": "Computer Science",
      "graduation_year": 2015
    }
  ],

  "skills": [
    {"name": "Python", "proficiency": "expert"},
    {"name": "Django", "proficiency": "advanced"},
    {"name": "AWS", "proficiency": "intermediate"}
  ],

  "certifications": [
    {"name": "AWS Certified Solutions Architect", "year": 2022}
  ],

  "languages": [
    {"language": "English", "proficiency": "native"},
    {"language": "Spanish", "proficiency": "conversational"}
  ]
}
```

### 6.3 AI Scoring Output Format

```json
{
  "application_id": "uuid",
  "job_id": "uuid",
  "candidate_id": "uuid",

  "timestamp": "2025-11-29T10:30:00Z",
  "model_version": "v1.0",

  "final_score": 86.3,
  "score_range": "high",

  "component_scores": {
    "skills_match": {
      "score": 85,
      "weight": 0.40,
      "weighted_contribution": 34.0,
      "details": {
        "required_skills": ["Python", "Django", "AWS", "Docker"],
        "candidate_skills": ["Python", "Django", "GCP"],
        "matched": ["Python", "Django"],
        "missing": ["AWS", "Docker"],
        "extra": ["GCP"],
        "explanation": "Candidate has 2/4 required skills. Has GCP instead of AWS (transferable)."
      }
    },

    "experience_match": {
      "score": 90,
      "weight": 0.35,
      "weighted_contribution": 31.5,
      "details": {
        "required_years": 5,
        "candidate_years": 7,
        "explanation": "Candidate exceeds minimum experience by 2 years."
      }
    },

    "education_match": {
      "score": 80,
      "weight": 0.15,
      "weighted_contribution": 12.0,
      "details": {
        "preferred": "Masters in Computer Science",
        "candidate_education": "B.S. Computer Science",
        "explanation": "Candidate has relevant degree but not advanced degree."
      }
    },

    "custom_answers": {
      "score": 88,
      "weight": 0.10,
      "weighted_contribution": 8.8,
      "details": {
        "question_1": {
          "question": "Why are you interested in this role?",
          "answer": "...",
          "quality_score": 88,
          "explanation": "Clear, specific reasons. Shows understanding of role."
        }
      }
    }
  },

  "recommendation": "STRONG_MATCH",
  "human_readable_summary": "John has excellent experience (7+ years) and strong skills overlap (Python, Django). Missing AWS/Docker experience but has equivalent GCP skills. Answers show genuine interest. Recommend for interview."
}
```

---

## 7. SUCCESS METRICS & KPIs

### 7.1 Product Metrics

| Metric | Target (MVP) | Target (6 months) | How to Measure |
|--------|--------------|------------------|-----------------|
| **Active Jobs** | 50 | 500+ | Database count |
| **Total Applications** | 5,000+ | 50,000+ | Applications table |
| **Avg Applications/Job** | 35 | 50+ | Analytics dashboard |
| **AI Ranking Accuracy** | 85%+ | 90%+ | HR feedback score comparison |
| **Resume Parse Success Rate** | 90%+ | 95%+ | Parse status tracking |
| **Avg Ranking Time** | <2 sec | <1 sec | Performance monitoring |
| **Candidate Conversion** | 10% (apply rate) | 15%+ | Views → applications |

### 7.2 Business Metrics

| Metric | Target (MVP) | Target (6 months) | How to Measure |
|--------|--------------|------------------|-----------------|
| **Paying Customers** | 15 | 50+ | Stripe dashboard |
| **MRR (Monthly Recurring)** | $3K | $15K+ | Revenue tracking |
| **Churn Rate** | <10% | <5% | Customer tracking |
| **Customer Acquisition Cost** | $500 | $300 | Marketing spend / customers |
| **Lifetime Value** | $5K | $15K+ | Avg customer revenue |
| **Net Promoter Score (NPS)** | >40 | >50 | Post-use survey |

### 7.3 User Experience Metrics

| Metric | Target | How to Measure |
|--------|--------|-----------------|
| **Page Load Time** | <2 sec (p95) | Lighthouse, monitoring |
| **API Response Time** | <1 sec (p95) | APM tool (DataDog, New Relic) |
| **System Uptime** | 99.5% | Monitoring dashboard |
| **User Satisfaction** | NPS >40 | In-app survey |
| **Feature Adoption** | >80% use core features | Analytics tracking |
| **Help Ticket Resolution** | <24 hours | Support ticket system |

---

## 8. IMPLEMENTATION PHASES

### Phase 1: MVP Foundation (Weeks 1-8)
**Scope**: Core job creation, application form, resume parsing, basic AI scoring

**Deliverables**:
- Job management system
- Public job portal
- Application form
- Resume parser (spaCy-based)
- Basic AI scoring algorithm
- HR dashboard with ranked candidates
- Basic email notifications

**Success Criteria**:
- 50+ jobs created by beta users
- 85%+ ranking accuracy
- <2 second ranking time
- 90%+ resume parse success
- NPS >35

---

### Phase 2: Enhanced Features (Weeks 9-16)
**Scope**: Advanced filtering, analytics, team collaboration, fairness monitoring

**Deliverables**:
- Advanced filtering & sorting
- Analytics dashboards
- Team collaboration (comments, mentions)
- Fairness audit reports
- Interview request workflow
- Candidate status tracking

**Success Criteria**:
- 200+ active jobs
- 30+ paying customers
- $5K MRR
- 90%+ ranking accuracy

---

### Phase 3: Integrations & Scale (Weeks 17-26)
**Scope**: HRIS integrations, multi-post feature, advanced analytics

**Deliverables**:
- Workday integration
- SuccessFactors integration
- LinkedIn multi-post
- Indeed integration
- Advanced analytics
- Custom branding
- Video interview support

**Success Criteria**:
- 500+ active jobs
- 50+ paying customers
- $15K MRR
- Enterprise clients acquired

---

### Phase 4: Uzbek Localization & Growth (Weeks 27+)
**Scope**: Full Uzbek language support, local market expansion

**Deliverables**:
- Uzbek language interface
- Uzbek NLP models (resume parsing in Uzbek)
- Local payment methods
- Uzbek customer support
- Local compliance features

**Success Criteria**:
- 50% of revenue from Uzbekistan
- 100+ Uzbek customers
- Uzbek-language testimonials
- Regional market leadership

---

## 9. RISKS & MITIGATION

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| **Low resume parse accuracy** | High | Medium | Extensive testing with 500+ real resumes, hybrid human review for edge cases |
| **AI scoring inaccuracy** | High | Medium | Collect HR feedback, retrain models quarterly, show explainability to build trust |
| **User adoption slow** | High | Medium | Free tier, 5-min onboarding, sales support, community outreach |
| **GDPR/compliance issues** | High | Low | Legal review, audit logs, data deletion capability, ToS clarity |
| **Unfair hiring bias** | High | Medium | Monthly fairness audits, protected attribute tracking, clear documentation |
| **Uzbek language support late** | Medium | High | Hire Uzbek NLP experts early, use transfer learning from Russian |
| **Integration delays (HRIS)** | Medium | Medium | Partner early with Workday/SuccessFactors, API-first design |
| **Server downtime/scaling issues** | Medium | Low | Use managed databases (AWS RDS), auto-scaling, 99.5% SLA target |
| **Competitor launch** | Medium | High | Move fast on MVP, get to market first, build network effects |

---

## 10. SUCCESS DEFINITION

### For MVP Launch (Week 8)
✅ Working platform with core features
✅ 50+ jobs created and live
✅ 85%+ AI ranking accuracy
✅ <2 second response times
✅ 10+ paying customers signed up
✅ NPS >35 from beta users
✅ Zero critical bugs in production

### For Public Launch (Month 6)
✅ 200+ active jobs across industries
✅ 50+ paying customers
✅ $5K monthly recurring revenue
✅ 90%+ AI ranking accuracy
✅ 99.5% uptime SLA maintained
✅ NPS >45 from users
✅ <5 hour customer support response

### For Long-term Success (Month 12)
✅ 500+ active jobs
✅ $15K+ monthly recurring revenue
✅ 50+ Uzbek-language customers
✅ Enterprise integrations live
✅ Market leader position in Central Asia
✅ Expansion to Kazakhstan, Kyrgyzstan

---

## 11. CONCLUSION

HR AI is positioned to capture the untapped market for affordable, AI-powered recruitment in Uzbekistan and Central Asia. By focusing on a narrow, well-defined MVP (job creation → resume parsing → AI matching), we can validate product-market fit quickly and build a sustainable business.

**Key Differentiators**:
- Uzbek language support (first-mover advantage)
- 10x cheaper than Workday/SuccessFactors
- Simple, intuitive interface (vs. complex enterprise software)
- AI-first approach (modern recruiting)

**Success requires**:
- Technical excellence in NLP/ML
- Relentless focus on accuracy and fairness
- Fast execution (8-week MVP timeline)
- Customer obsession (feedback loops)

**Expected Outcome**:
- Profitable SaaS business within 6 months
- Regional market dominance within 12 months
- Acquisition or IPO potential by year 2

---

## APPENDIX A: GLOSSARY

| Term | Definition |
|------|-----------|
| **ATS** | Applicant Tracking System - software to manage recruitment process |
| **HRIS** | Human Resources Information System - central HR data management |
| **NLP** | Natural Language Processing - AI technique to parse text |
| **ML** | Machine Learning - algorithms that learn from data |
| **MRR** | Monthly Recurring Revenue - predictable monthly income |
| **NPS** | Net Promoter Score - customer satisfaction metric (0-100) |
| **TAM/SAM/SOM** | Total/Serviceable/Serviceable Obtainable Market |
| **GDPR** | General Data Protection Regulation - EU data protection law |
| **CCPA** | California Consumer Privacy Act - US data protection law |
| **API** | Application Programming Interface - software integration |
| **JWT** | JSON Web Token - secure authentication method |
| **OAuth** | Open standard for secure authorization |

---

## APPENDIX B: REFERENCE MATERIALS

**AI Recruitment Platforms Analyzed**:
- Greenhouse, Lever, SmartRecruiters (feature research)
- Workday SuccessFactors (enterprise baseline)
- TurboHire, Paradox (AI-first comparison)

**Technology Stack References**:
- FastAPI documentation
- spaCy NLP library
- scikit-learn ML library
- React documentation
- PostgreSQL best practices

**Market Research Sources**:
- Uzbekistan ICT market reports (2024-2025)
- Central Asia HR tech surveys
- AI adoption statistics (HR leaders)

---

**Document prepared for**: Product Development Team
**Approval Status**: READY FOR REVIEW
**Next Steps**: Architecture design → Technical specification → Sprint planning

