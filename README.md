# HR AI - AI-Powered Resume Screening Platform

AI-powered platform for HR managers to screen and rank job candidates automatically.

## Screenshots

### Dashboard
![Dashboard](docs/images/dashboard.png)

### Job Detail Page
![Job Detail](docs/images/job-detail.png)

### Candidate Analysis Modal
![Candidate Modal](docs/images/candidate-modal.png)

## Features

- **Job Management**: Create and manage job postings with required skills
- **Public Application Links**: Share unique links for candidates to apply
- **AI Resume Analysis**: OpenAI GPT-4o-mini powered candidate evaluation
- **Smart Scoring**: AI-powered candidate ranking based on job requirements
- **Candidate Management**: Review, interview, or reject candidates
- **Resume Download**: Download candidate resumes directly
- **HR Notes**: Add private notes to candidate profiles
- **Skills Matching**: View matched and missing skills for each candidate

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4o-mini for resume analysis
- **Resume Parsing**: pdfplumber, python-docx

## Quick Start

### Using Docker (Recommended)

```bash
# Clone and start
docker-compose up -d

# Access the app
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000/api/docs
```

### Manual Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your database credentials and OpenAI API key

# Run server (tables are auto-created on startup)
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Run development server
npm run dev
```

#### Database

```bash
# Using Docker
docker run -d --name hrai-db \
  -e POSTGRES_USER=hrai_user \
  -e POSTGRES_PASSWORD=hrai_password \
  -e POSTGRES_DB=hrai \
  -p 5432:5432 \
  postgres:15-alpine
```

## Project Structure

```
hrai/
├── backend/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── ml/            # AI analysis & resume parsing
│   │   ├── db/            # Database config
│   │   └── utils/         # Utilities
│   ├── uploads/           # Resume storage
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   ├── hooks/         # Custom hooks
│   │   └── types/         # TypeScript types
│   └── package.json
│
├── docker-compose.yml     # Development setup
├── docker-compose.prod.yml # Production setup
└── nginx/                 # Nginx config
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs` - List jobs
- `GET /api/jobs/{id}` - Get job details
- `PATCH /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job

### Public (Candidates)
- `GET /api/public/jobs/{link}` - View job
- `POST /api/public/apply/{link}` - Submit application

### Applications
- `GET /api/jobs/{id}/applications` - List candidates
- `GET /api/applications/{id}` - Get candidate details
- `POST /api/applications/{id}/action` - Interview/Reject/Hire
- `PUT /api/applications/{id}/notes` - Update HR notes
- `GET /api/applications/{id}/resume` - Download resume

## Environment Variables

### Backend
```
DATABASE_URL=postgresql://user:pass@localhost:5432/hrai
SECRET_KEY=your-secret-key
UPLOAD_DIR=./uploads/resumes
OPENAI_API_KEY=your-openai-api-key
```

### Frontend
```
VITE_API_URL=http://localhost:8000/api
```

## License

MIT
