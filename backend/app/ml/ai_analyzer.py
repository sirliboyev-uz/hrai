"""
AI-powered resume analysis using OpenAI GPT
"""
import json
from typing import Dict, List, Optional
from openai import OpenAI
from app.config import get_settings

settings = get_settings()


class AIAnalyzer:
    """Analyze resumes and score candidates using OpenAI GPT"""

    def __init__(self):
        self.client = None
        if settings.openai_api_key:
            self.client = OpenAI(api_key=settings.openai_api_key)

    def is_available(self) -> bool:
        """Check if AI analysis is available"""
        return self.client is not None

    def analyze_resume(self, resume_text: str, job_data: Dict) -> Dict:
        """
        Analyze resume against job requirements using AI

        Args:
            resume_text: Full text extracted from resume
            job_data: Job requirements including title, description, skills, experience

        Returns:
            Dict with score, breakdown, and explanation
        """
        if not self.is_available():
            return self._fallback_analysis(resume_text, job_data)

        try:
            prompt = self._build_analysis_prompt(resume_text, job_data)

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert HR recruiter AI assistant. Analyze resumes against job requirements and provide objective scoring.

Always respond with valid JSON in this exact format:
{
    "final_score": <number 0-100>,
    "skills_score": <number 0-100>,
    "experience_score": <number 0-100>,
    "matched_skills": ["skill1", "skill2"],
    "missing_skills": ["skill1", "skill2"],
    "years_of_experience": <number or null>,
    "explanation": "Brief 2-3 sentence explanation of the score",
    "strengths": ["strength1", "strength2"],
    "concerns": ["concern1", "concern2"]
}"""
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=1000
            )

            result_text = response.choices[0].message.content.strip()

            # Parse JSON from response
            if result_text.startswith("```"):
                result_text = result_text.split("```")[1]
                if result_text.startswith("json"):
                    result_text = result_text[4:]

            result = json.loads(result_text)

            return {
                "final_score": min(100, max(0, result.get("final_score", 50))),
                "score_breakdown": {
                    "skills": result.get("skills_score", 50),
                    "experience": result.get("experience_score", 50)
                },
                "matched_skills": result.get("matched_skills", []),
                "missing_skills": result.get("missing_skills", []),
                "years_of_experience": result.get("years_of_experience"),
                "explanation": result.get("explanation", "AI analysis completed."),
                "strengths": result.get("strengths", []),
                "concerns": result.get("concerns", []),
                "ai_powered": True
            }

        except Exception as e:
            print(f"AI analysis error: {e}")
            return self._fallback_analysis(resume_text, job_data)

    def _build_analysis_prompt(self, resume_text: str, job_data: Dict) -> str:
        """Build the analysis prompt for GPT"""
        job_title = job_data.get("title", "Unknown Position")
        job_description = job_data.get("description", "")
        job_requirements = job_data.get("requirements", "")
        required_skills = job_data.get("skills", [])
        min_experience = job_data.get("min_experience", 0)

        # Truncate resume if too long
        max_resume_length = 4000
        if len(resume_text) > max_resume_length:
            resume_text = resume_text[:max_resume_length] + "... [truncated]"

        return f"""Analyze this resume against the job requirements:

## JOB DETAILS
**Title:** {job_title}
**Description:** {job_description}
**Requirements:** {job_requirements}
**Required Skills:** {', '.join(required_skills) if required_skills else 'Not specified'}
**Minimum Experience:** {min_experience} years

## CANDIDATE RESUME
{resume_text}

## ANALYSIS INSTRUCTIONS
1. Extract the candidate's skills from the resume (look for explicit mentions and implied skills)
2. Determine years of experience (look for dates, explicit mentions, or estimate from career progression)
3. Compare skills against required skills (consider synonyms like React/React.js, PostgreSQL/Postgres)
4. Score skills match (0-100): percentage of required skills the candidate has
5. Score experience match (0-100): based on meeting/exceeding minimum years requirement
6. Calculate final score: weighted average (40% skills, 60% experience)
7. Identify strengths and potential concerns

Provide your analysis as JSON."""

    def _fallback_analysis(self, resume_text: str, job_data: Dict) -> Dict:
        """Fallback to rule-based analysis if AI is not available"""
        return {
            "final_score": 50,
            "score_breakdown": {
                "skills": 50,
                "experience": 50
            },
            "matched_skills": [],
            "missing_skills": job_data.get("skills", []),
            "years_of_experience": None,
            "explanation": "AI analysis not available. Using default score.",
            "strengths": [],
            "concerns": ["AI analysis unavailable"],
            "ai_powered": False
        }


# Singleton instance
ai_analyzer = AIAnalyzer()
