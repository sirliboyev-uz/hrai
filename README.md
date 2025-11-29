# HR AI - AI-Powered Resume Screening Platform

AI-powered platform for HR managers to screen and rank job candidates automatically.

## Features

- **Job Management**: Create and manage job postings with required skills
- **Public Application Links**: Share unique links for candidates to apply
- **AI Resume Parsing**: Automatic extraction of skills and experience
- **Smart Scoring**: AI-powered candidate ranking based on job requirements
- **Candidate Management**: Review, interview, or reject candidates

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI/ML**: spaCy for NLP

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
python -m spacy download en_core_web_sm

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations (tables are auto-created on startup)
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
│   │   ├── ml/            # AI/ML components
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

### Public (Candidates)
- `GET /api/public/jobs/{link}` - View job
- `POST /api/public/apply/{link}` - Submit application

### Applications
- `GET /api/jobs/{id}/applications` - List candidates
- `POST /api/applications/{id}/action` - Interview/Reject

## Environment Variables

### Backend
```
DATABASE_URL=postgresql://user:pass@localhost:5432/hrai
SECRET_KEY=your-secret-key
UPLOAD_DIR=./uploads/resumes
```

### Frontend
```
VITE_API_URL=http://localhost:8000/api
```

## License

MIT
