# ARCHITECTURE DESIGN DOCUMENT
## HR AI - AI-Powered Resume Screening Platform

**Framework**: BMAD (Architecture Phase)
**Version**: 2.0 (Simplified MVP)
**Status**: READY FOR DEVELOPMENT
**Last Updated**: 2025-11-29

---

## DESIGN PHILOSOPHY

> **"The simplest solution that works."**

This architecture is designed for MVP:
- ❌ No Redis
- ❌ No AWS services (S3, EC2, RDS, etc.)
- ❌ No CDN
- ❌ No background workers
- ❌ No message queues
- ✅ Just **React + FastAPI + PostgreSQL**
- ✅ Everything runs on ONE server
- ✅ Files stored on local disk
- ✅ Emails sent directly (or skipped for MVP)

---

## 1. TECHNOLOGY STACK

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React + TypeScript | Modern, type-safe |
| **Backend** | FastAPI (Python) | Simple, fast, great for ML |
| **Database** | PostgreSQL | Reliable, JSON support |
| **File Storage** | Local disk | Simple, free |
| **ML/NLP** | spaCy | Production-ready NLP |

**That's it. Nothing else.**

---

## 2. SYSTEM ARCHITECTURE

### 2.1 Simple Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SINGLE SERVER (VPS)                          │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   FRONTEND      │    │   BACKEND       │                    │
│  │   (React)       │    │   (FastAPI)     │                    │
│  │                 │    │                 │                    │
│  │   Port: 3000    │───►│   Port: 8000    │                    │
│  │   (dev only)    │    │                 │                    │
│  └─────────────────┘    └────────┬────────┘                    │
│                                  │                              │
│         ┌────────────────────────┼────────────────────────┐    │
│         │                        │                        │    │
│         ▼                        ▼                        ▼    │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐│
│  │   PostgreSQL    │    │   Local Files   │    │   spaCy     ││
│  │                 │    │   /uploads/     │    │   (NLP)     ││
│  │   Port: 5432    │    │   resumes/      │    │             ││
│  └─────────────────┘    └─────────────────┘    └─────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Request Flow (Simplified)

```
CANDIDATE APPLIES:

1. Candidate fills form + uploads resume
          ↓
2. Frontend sends POST to /api/apply
          ↓
3. Backend:
   - Saves file to /uploads/resumes/{uuid}.pdf
   - Parses resume with spaCy (SYNC, not async)
   - Scores candidate
   - Saves to database
          ↓
4. Returns 201 Created
          ↓
5. Frontend shows "Thank you!"


HR VIEWS CANDIDATES:

1. HR opens job page
          ↓
2. Frontend sends GET /api/jobs/{id}/applications
          ↓
3. Backend queries database (sorted by ai_score DESC)
          ↓
4. Returns JSON with ranked candidates
          ↓
5. Frontend displays list
```

**Key difference**: Resume parsing happens **synchronously** (immediately) instead of in a background queue. For MVP with <100 applications/day, this is fine.

---

## 3. PROJECT STRUCTURE

```
hrai/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Settings
│   │   │
│   │   ├── api/                 # API routes
│   │   │   ├── __init__.py
│   │   │   ├── auth.py          # /auth/login, /auth/register
│   │   │   ├── jobs.py          # /jobs CRUD
│   │   │   └── applications.py  # /apply, /applications
│   │   │
│   │   ├── models/              # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── job.py
│   │   │   ├── candidate.py
│   │   │   └── application.py
│   │   │
│   │   ├── schemas/             # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── job.py
│   │   │   └── application.py
│   │   │
│   │   ├── services/            # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── job.py
│   │   │   └── application.py
│   │   │
│   │   ├── ml/                  # AI/ML
│   │   │   ├── __init__.py
│   │   │   ├── resume_parser.py
│   │   │   └── scorer.py
│   │   │
│   │   ├── db/                  # Database
│   │   │   ├── __init__.py
│   │   │   └── database.py
│   │   │
│   │   └── utils/               # Helpers
│   │       ├── __init__.py
│   │       └── security.py      # JWT, password hashing
│   │
│   ├── uploads/                 # File storage
│   │   └── resumes/             # Resume files
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/            # API client
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 4. DATABASE SCHEMA

### 4.1 ERD (Simple)

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   USERS     │      │    JOBS     │      │ CANDIDATES  │
├─────────────┤      ├─────────────┤      ├─────────────┤
│ id          │──1:N─│ id          │      │ id          │
│ email       │      │ user_id     │      │ email       │
│ password    │      │ title       │      │ phone       │
│ company_name│      │ description │      │ full_name   │
│ created_at  │      │ requirements│      │ years_exp   │
└─────────────┘      │ skills[]    │      └──────┬──────┘
                     │ min_exp     │             │
                     │ public_link │             │
                     │ status      │             │
                     └──────┬──────┘             │
                            │                    │
                            │        ┌───────────┘
                            │        │
                            ▼        ▼
                     ┌─────────────────┐
                     │  APPLICATIONS   │
                     ├─────────────────┤
                     │ id              │
                     │ job_id          │
                     │ candidate_id    │
                     │ resume_path     │
                     │ resume_parsed   │
                     │ ai_score        │
                     │ score_breakdown │
                     │ explanation     │
                     │ status          │
                     │ applied_at      │
                     └─────────────────┘
```

### 4.2 SQL Schema

```sql
-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (HR Managers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    skills JSONB DEFAULT '[]',
    min_experience INT DEFAULT 0,
    public_link VARCHAR(20) UNIQUE,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Candidates
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    years_of_experience INT,
    current_company VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Applications
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,

    resume_path VARCHAR(500),
    resume_parsed JSONB,

    ai_score DECIMAL(5,2),
    score_breakdown JSONB,
    explanation TEXT,

    status VARCHAR(30) DEFAULT 'applied',
    applied_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(job_id, candidate_id)
);

-- Indexes
CREATE INDEX idx_jobs_user ON jobs(user_id);
CREATE INDEX idx_jobs_link ON jobs(public_link);
CREATE INDEX idx_apps_job ON applications(job_id);
CREATE INDEX idx_apps_score ON applications(job_id, ai_score DESC);
```

---

## 5. API ENDPOINTS

### 5.1 Endpoint Summary

```
Base URL: http://localhost:8000/api

Auth:
  POST /auth/register     → Create account
  POST /auth/login        → Get JWT token
  GET  /auth/me           → Get current user

Jobs (requires auth):
  POST /jobs              → Create job
  GET  /jobs              → List my jobs
  GET  /jobs/{id}         → Get job details

Public:
  GET  /public/jobs/{link}     → Get job by public link
  POST /public/apply/{link}    → Submit application

Applications (requires auth):
  GET  /jobs/{id}/applications → Get ranked candidates
  GET  /applications/{id}      → Get application details
  POST /applications/{id}/action → Interview/Reject
```

### 5.2 Key Endpoints Detail

#### POST /auth/login
```json
Request:
{
  "email": "hr@company.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "hr@company.com",
    "company_name": "Tech Corp"
  }
}
```

#### POST /jobs
```json
Request:
{
  "title": "Senior Python Engineer",
  "description": "We are looking for...",
  "requirements": "5+ years Python...",
  "skills": ["Python", "Django", "PostgreSQL"],
  "min_experience": 5
}

Response:
{
  "id": "uuid",
  "title": "Senior Python Engineer",
  "public_link": "abc123",
  "status": "published",
  "created_at": "2025-11-29T10:00:00Z"
}
```

#### POST /public/apply/{link}
```
Request: multipart/form-data
  - full_name: "John Smith"
  - email: "john@email.com"
  - phone: "+998901234567"
  - years_of_experience: 7
  - resume: <file.pdf>

Response:
{
  "message": "Application submitted successfully",
  "application_id": "uuid"
}
```

#### GET /jobs/{id}/applications
```json
Response:
{
  "applications": [
    {
      "id": "uuid",
      "candidate": {
        "full_name": "John Smith",
        "email": "john@email.com",
        "years_of_experience": 7
      },
      "ai_score": 88.5,
      "score_breakdown": {
        "skills": 85,
        "experience": 92
      },
      "explanation": "Matched: Python, Django. Missing: AWS",
      "status": "applied",
      "applied_at": "2025-11-29T10:00:00Z"
    }
  ],
  "total": 25
}
```

---

## 6. AI/ML PIPELINE (SIMPLIFIED)

### 6.1 How It Works

```
Resume file uploaded
        ↓
Extract text (pdfplumber / python-docx)
        ↓
Parse with spaCy:
  - Extract name, email, phone
  - Find skills (pattern matching)
  - Find years of experience
        ↓
Compare with job requirements:
  - Skills match: candidate skills ∩ required skills
  - Experience match: candidate years vs required years
        ↓
Calculate score:
  - Skills: 40% weight
  - Experience: 60% weight
  - Final: 0-100
        ↓
Save to database
```

### 6.2 Resume Parser (Simple Version)

```python
# app/ml/resume_parser.py

import pdfplumber
from docx import Document
import re
from typing import Dict, List

SKILLS = [
    "Python", "Django", "FastAPI", "Flask",
    "JavaScript", "TypeScript", "React", "Vue",
    "PostgreSQL", "MySQL", "MongoDB",
    "AWS", "Docker", "Git"
]

class ResumeParser:

    def extract_text(self, file_path: str) -> str:
        """Extract text from PDF or DOCX"""
        if file_path.endswith('.pdf'):
            with pdfplumber.open(file_path) as pdf:
                return "\n".join(page.extract_text() or "" for page in pdf.pages)
        elif file_path.endswith('.docx'):
            doc = Document(file_path)
            return "\n".join(p.text for p in doc.paragraphs)
        return ""

    def extract_email(self, text: str) -> str:
        match = re.search(r'[\w.-]+@[\w.-]+\.\w+', text)
        return match.group() if match else ""

    def extract_phone(self, text: str) -> str:
        match = re.search(r'[\+]?[\d\s\-\(\)]{10,}', text)
        return match.group().strip() if match else ""

    def extract_skills(self, text: str) -> List[str]:
        text_lower = text.lower()
        return [s for s in SKILLS if s.lower() in text_lower]

    def extract_experience(self, text: str) -> int:
        patterns = [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
            r'experience\s*:\s*(\d+)\s*years?',
        ]
        for pattern in patterns:
            match = re.search(pattern, text.lower())
            if match:
                return int(match.group(1))
        return 0

    def parse(self, file_path: str) -> Dict:
        text = self.extract_text(file_path)
        return {
            "email": self.extract_email(text),
            "phone": self.extract_phone(text),
            "skills": self.extract_skills(text),
            "years_of_experience": self.extract_experience(text),
            "raw_text": text[:3000]
        }
```

### 6.3 Scorer (Simple Version)

```python
# app/ml/scorer.py

from typing import Dict, List

class Scorer:

    def __init__(self, skills_weight=0.4, exp_weight=0.6):
        self.skills_weight = skills_weight
        self.exp_weight = exp_weight

    def score(self, resume: Dict, job: Dict) -> Dict:
        # Skills match
        candidate_skills = set(s.lower() for s in resume.get("skills", []))
        required_skills = set(s.lower() for s in job.get("skills", []))

        if required_skills:
            matched = candidate_skills & required_skills
            skills_score = len(matched) / len(required_skills) * 100
        else:
            skills_score = 100

        # Experience match
        candidate_exp = resume.get("years_of_experience", 0)
        required_exp = job.get("min_experience", 0)

        if required_exp > 0:
            if candidate_exp >= required_exp:
                exp_score = 100
            else:
                exp_score = candidate_exp / required_exp * 100
        else:
            exp_score = 100

        # Final score
        final = skills_score * self.skills_weight + exp_score * self.exp_weight

        # Explanation
        matched_list = [s for s in resume.get("skills", [])
                       if s.lower() in required_skills]
        missing_list = [s for s in job.get("skills", [])
                       if s.lower() not in candidate_skills]

        explanation = f"Matched: {', '.join(matched_list) or 'None'}. "
        if missing_list:
            explanation += f"Missing: {', '.join(missing_list)}. "
        explanation += f"Experience: {candidate_exp} years."

        return {
            "final_score": round(final, 2),
            "score_breakdown": {
                "skills": round(skills_score, 2),
                "experience": round(exp_score, 2)
            },
            "explanation": explanation
        }
```

---

## 7. AUTHENTICATION

### 7.1 JWT Authentication (Simple)

```python
# app/utils/security.py

from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt

SECRET_KEY = "your-secret-key"  # Move to .env
ALGORITHM = "HS256"
EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"])

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    return jwt.encode({"sub": user_id, "exp": expire}, SECRET_KEY, ALGORITHM)

def decode_token(token: str) -> str:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload.get("sub")
```

---

## 8. FRONTEND STRUCTURE

```
frontend/src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   └── jobs/
│       ├── JobCard.tsx
│       ├── JobForm.tsx
│       └── CandidateList.tsx
│
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── hr/
│   │   ├── Dashboard.tsx
│   │   ├── CreateJob.tsx
│   │   └── JobDetail.tsx
│   └── public/
│       ├── Jobs.tsx
│       └── Apply.tsx
│
├── services/
│   └── api.ts              # Axios client
│
├── types/
│   └── index.ts            # TypeScript interfaces
│
├── App.tsx
└── main.tsx
```

### 8.1 API Client

```typescript
// services/api.ts

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 8.2 Types

```typescript
// types/index.ts

export interface User {
  id: string;
  email: string;
  company_name: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  skills: string[];
  min_experience: number;
  public_link: string;
  status: string;
  applications_count?: number;
  created_at: string;
}

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  years_of_experience: number;
  current_company?: string;
}

export interface Application {
  id: string;
  candidate: Candidate;
  ai_score: number;
  score_breakdown: {
    skills: number;
    experience: number;
  };
  explanation: string;
  status: string;
  applied_at: string;
}
```

---

## 9. LOCAL DEVELOPMENT SETUP

### 9.1 Requirements

```
# Backend requirements.txt
fastapi==0.109.0
uvicorn==0.27.0
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
python-jose==3.3.0
passlib==1.7.4
bcrypt==4.1.2
python-multipart==0.0.6
pdfplumber==0.10.3
python-docx==1.1.0
spacy==3.7.2

# Download spaCy model
# python -m spacy download en_core_web_sm
```

### 9.2 Environment Variables

```bash
# backend/.env

DATABASE_URL=postgresql://user:password@localhost:5432/hrai
SECRET_KEY=your-super-secret-key-change-this
UPLOAD_DIR=./uploads/resumes

# frontend/.env
VITE_API_URL=http://localhost:8000/api
```

### 9.3 Run Locally

```bash
# Terminal 1: Database
docker run -d --name hrai-db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=hrai \
  -p 5432:5432 \
  postgres:15

# Terminal 2: Backend
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload --port 8000

# Terminal 3: Frontend
cd frontend
npm install
npm run dev
```

### 9.4 Docker Configuration

#### Project Structure with Docker

```
hrai/
├── docker-compose.yml          # Main orchestration file
├── docker-compose.dev.yml      # Development overrides
├── docker-compose.prod.yml     # Production overrides
├── .dockerignore
│
├── backend/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── ...
│
└── frontend/
    ├── Dockerfile
    ├── Dockerfile.dev
    ├── nginx.conf              # For production
    └── ...
```

#### Backend Dockerfile

```dockerfile
# backend/Dockerfile

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model
RUN python -m spacy download en_core_web_sm

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p /app/uploads/resumes

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Backend Development Dockerfile

```dockerfile
# backend/Dockerfile.dev

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm

# Install dev dependencies
RUN pip install --no-cache-dir pytest pytest-asyncio httpx

EXPOSE 8000

# Run with hot reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

#### Frontend Dockerfile (Production)

```dockerfile
# frontend/Dockerfile

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Frontend Development Dockerfile

```dockerfile
# frontend/Dockerfile.dev

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

#### Frontend Nginx Config

```nginx
# frontend/nginx.conf

server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Docker Compose (Development)

```yaml
# docker-compose.yml

version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: hrai-db
    environment:
      POSTGRES_USER: hrai_user
      POSTGRES_PASSWORD: hrai_password
      POSTGRES_DB: hrai
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hrai_user -d hrai"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: hrai-backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://hrai_user:hrai_password@db:5432/hrai
      SECRET_KEY: dev-secret-key-change-in-production
      UPLOAD_DIR: /app/uploads/resumes
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - backend_uploads:/app/uploads
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: hrai-frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:8000/api
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

volumes:
  postgres_data:
  backend_uploads:
```

#### Docker Compose (Production)

```yaml
# docker-compose.prod.yml

version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: hrai-db
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    # No port exposed - internal only

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: hrai-backend
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      SECRET_KEY: ${SECRET_KEY}
      UPLOAD_DIR: /app/uploads/resumes
    depends_on:
      - db
    volumes:
      - backend_uploads:/app/uploads
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: hrai-frontend
    restart: always

  nginx:
    image: nginx:alpine
    container_name: hrai-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - backend_uploads:/var/www/uploads:ro
    depends_on:
      - backend
      - frontend
    restart: always

volumes:
  postgres_data:
  backend_uploads:
```

#### Production Nginx (Reverse Proxy)

```nginx
# nginx/nginx.conf

events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:80;
    }

    server {
        listen 80;
        server_name hrai.uz www.hrai.uz;

        # Redirect HTTP to HTTPS (uncomment when SSL is set up)
        # return 301 https://$server_name$request_uri;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Backend API
        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # File upload size
            client_max_body_size 10M;
        }

        # Resume files (protected - accessed through API)
        location /uploads {
            alias /var/www/uploads;
            internal;
        }
    }
}
```

#### .dockerignore

```
# .dockerignore

# Python
__pycache__
*.pyc
*.pyo
.pytest_cache
.mypy_cache
venv/
.env
*.egg-info

# Node
node_modules/
dist/
.next/
.nuxt/

# IDE
.vscode/
.idea/

# Git
.git/
.gitignore

# Docker
Dockerfile*
docker-compose*

# Docs
*.md
docs/

# Tests
tests/
coverage/
```

#### Docker Commands

```bash
# Development
docker-compose up -d              # Start all services
docker-compose up -d --build      # Rebuild and start
docker-compose logs -f backend    # View backend logs
docker-compose down               # Stop all services
docker-compose down -v            # Stop and remove volumes

# Production
docker-compose -f docker-compose.prod.yml up -d --build

# Database access
docker exec -it hrai-db psql -U hrai_user -d hrai

# Backend shell
docker exec -it hrai-backend bash

# View logs
docker-compose logs -f

# Restart single service
docker-compose restart backend
```

#### Environment File (.env.example)

```bash
# .env.example

# Database
DB_USER=hrai_user
DB_PASSWORD=secure_password_here
DB_NAME=hrai

# Backend
SECRET_KEY=your-super-secret-key-minimum-32-characters
UPLOAD_DIR=/app/uploads/resumes

# Frontend
VITE_API_URL=http://localhost:8000/api
```

---

## 10. DEPLOYMENT (SIMPLE)

### 10.1 Single VPS Deployment

For MVP, deploy everything on one VPS ($5-10/month):

```
┌─────────────────────────────────────────┐
│           VPS (Ubuntu 22.04)            │
│           2GB RAM, 1 vCPU               │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Nginx (reverse proxy)          │    │
│  │  - Port 80 → Frontend           │    │
│  │  - Port 80/api → Backend:8000   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Backend (FastAPI + Uvicorn)    │    │
│  │  - Port 8000                    │    │
│  │  - Systemd service              │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Frontend (Static files)        │    │
│  │  - Built React app              │    │
│  │  - Served by Nginx              │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  PostgreSQL                     │    │
│  │  - Port 5432 (local only)       │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  /var/www/hrai/uploads/         │    │
│  │  Resume files stored here       │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### 10.2 Nginx Config

```nginx
# /etc/nginx/sites-available/hrai

server {
    listen 80;
    server_name hrai.uz www.hrai.uz;

    # Frontend (React)
    location / {
        root /var/www/hrai/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Resume files
    location /uploads {
        alias /var/www/hrai/uploads;
    }
}
```

### 10.3 Systemd Service

```ini
# /etc/systemd/system/hrai-api.service

[Unit]
Description=HR AI Backend API
After=network.target postgresql.service

[Service]
User=www-data
WorkingDirectory=/var/www/hrai/backend
ExecStart=/var/www/hrai/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## 11. COST (MVP)

| Item | Cost/Month |
|------|-----------|
| **VPS (DigitalOcean/Hetzner)** | $5-10 |
| **Domain** | $1 (yearly) |
| **SSL (Let's Encrypt)** | FREE |
| **PostgreSQL** | Included on VPS |
| **File Storage** | Included on VPS |
| **TOTAL** | **~$10/month** |

No AWS. No Redis. No CDN. No complex infrastructure.

---

## 12. WHAT'S NOT INCLUDED (Add Later)

For MVP, we skip:
- ❌ Email notifications (add later with SMTP or SendGrid)
- ❌ Background job processing (sync is fine for MVP)
- ❌ Rate limiting (add later)
- ❌ Monitoring/alerting (add later)
- ❌ SSL certificate auto-renewal (use certbot)
- ❌ Automated backups (manual for now)

---

## 13. SCALING ROADMAP (WHEN NEEDED)

| Stage | Traffic | Changes |
|-------|---------|---------|
| **MVP** | <100 users | Single VPS, everything together |
| **Growth** | 100-500 | Add Redis for caching, separate DB |
| **Scale** | 500-2000 | Multiple API servers, load balancer |
| **Enterprise** | 2000+ | Kubernetes, managed database |

**Don't optimize prematurely. Start simple.**

---

## SUMMARY

**MVP Tech Stack:**
- Frontend: React + TypeScript
- Backend: FastAPI + Python
- Database: PostgreSQL
- ML: spaCy
- Deployment: Single VPS ($10/month)

**Files:**
- No S3 (local disk)
- No Redis (sync processing)
- No CDN (nginx serves static files)

**Complexity:**
- 4 database tables
- ~10 API endpoints
- 1 server
- 6-8 weeks to build

---

**Document Status**: READY FOR DEVELOPMENT
**Next Steps**: Start coding!

