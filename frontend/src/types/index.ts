// User types
export interface User {
  id: string;
  email: string;
  company_name: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Job types
export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  skills: string[];
  min_experience: number;
  public_link: string;
  status: string;
  created_at: string;
  applications_count?: number;
}

export interface JobPublic {
  id: string;
  title: string;
  description: string;
  requirements: string;
  skills: string[];
  min_experience: number;
  company_name: string | null;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
}

// Application types
export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  years_of_experience: number | null;
}

export interface ScoreBreakdown {
  skills: number;
  experience: number;
  matched_skills?: string[];
  missing_skills?: string[];
  strengths?: string[];
  concerns?: string[];
  ai_powered?: boolean;
}

export interface ParsedResume {
  raw_text?: string;
  email?: string;
  phone?: string;
  name?: string;
  skills?: string[];
  years_of_experience?: number;
}

export interface Application {
  id: string;
  candidate: Candidate;
  ai_score: number | null;
  score_breakdown: ScoreBreakdown | null;
  explanation: string | null;
  status: string;
  applied_at: string;
  resume_path: string | null;
}

export interface ApplicationDetail extends Application {
  resume_parsed: ParsedResume | null;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  concerns: string[];
  notes: string | null;
}

export interface ApplicationListResponse {
  applications: Application[];
  total: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  company_name: string;
}

export interface JobForm {
  title: string;
  description: string;
  requirements: string;
  skills: string[];
  min_experience: number;
}

export interface ApplicationForm {
  full_name: string;
  email: string;
  phone: string;
  years_of_experience: number;
  resume: File | null;
}
