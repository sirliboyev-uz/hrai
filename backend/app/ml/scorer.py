from typing import Dict, List, Optional, Set, Tuple
from decimal import Decimal


# Skill synonyms and variations for fuzzy matching
SKILL_SYNONYMS = {
    # JavaScript ecosystem
    "javascript": ["js", "es6", "es2015", "ecmascript"],
    "typescript": ["ts"],
    "react": ["reactjs", "react.js", "react js"],
    "vue": ["vuejs", "vue.js", "vue js"],
    "angular": ["angularjs", "angular.js"],
    "node.js": ["nodejs", "node", "node js"],
    "next.js": ["nextjs", "next"],
    "express": ["expressjs", "express.js"],

    # Python ecosystem
    "python": ["py", "python3", "python 3"],
    "django": ["django rest", "drf"],
    "fastapi": ["fast api"],
    "flask": ["flask api"],
    "pandas": ["pd"],
    "numpy": ["np"],

    # Databases
    "postgresql": ["postgres", "psql", "pg"],
    "mongodb": ["mongo"],
    "mysql": ["mariadb"],
    "redis": ["redis cache"],
    "elasticsearch": ["elastic", "es"],

    # Cloud & DevOps
    "aws": ["amazon web services", "amazon aws"],
    "gcp": ["google cloud", "google cloud platform"],
    "azure": ["microsoft azure", "ms azure"],
    "docker": ["containerization", "containers"],
    "kubernetes": ["k8s", "kube"],
    "ci/cd": ["cicd", "ci cd", "continuous integration"],

    # General
    "rest api": ["restful", "rest", "restful api"],
    "graphql": ["graph ql"],
    "git": ["github", "gitlab", "version control"],
    "agile": ["scrum", "kanban"],
    "machine learning": ["ml", "deep learning", "dl"],
    "artificial intelligence": ["ai"],
}

# Build reverse lookup
SKILL_REVERSE_LOOKUP = {}
for main_skill, variations in SKILL_SYNONYMS.items():
    SKILL_REVERSE_LOOKUP[main_skill] = main_skill
    for var in variations:
        SKILL_REVERSE_LOOKUP[var] = main_skill


class Scorer:
    """Score candidates based on job requirements with intelligent matching"""

    def __init__(self, skills_weight: float = 0.4, experience_weight: float = 0.6):
        self.skills_weight = skills_weight
        self.experience_weight = experience_weight

    def normalize_skill(self, skill: str) -> str:
        """Normalize skill name to canonical form"""
        skill_lower = skill.lower().strip()
        return SKILL_REVERSE_LOOKUP.get(skill_lower, skill_lower)

    def calculate_skills_score(
        self,
        candidate_skills: List[str],
        required_skills: List[str]
    ) -> Tuple[float, List[str], List[str]]:
        """
        Calculate skills match score with fuzzy matching

        Returns:
            tuple: (score, matched_skills, missing_skills)
        """
        if not required_skills:
            return 100.0, [], []

        # Normalize all skills
        candidate_normalized = {self.normalize_skill(s) for s in candidate_skills}

        matched_original = []
        missing_original = []

        for req_skill in required_skills:
            req_normalized = self.normalize_skill(req_skill)

            # Check for exact match or normalized match
            if req_normalized in candidate_normalized:
                matched_original.append(req_skill)
            # Check for partial match (skill contained in candidate skill)
            elif any(req_normalized in cs or cs in req_normalized for cs in candidate_normalized):
                matched_original.append(req_skill)
            else:
                missing_original.append(req_skill)

        score = (len(matched_original) / len(required_skills)) * 100

        return score, matched_original, missing_original

    def calculate_experience_score(
        self,
        candidate_years: Optional[int],
        required_years: int
    ) -> float:
        """Calculate experience match score"""
        if required_years <= 0:
            return 100.0

        if candidate_years is None:
            return 50.0  # Unknown experience - give benefit of doubt

        if candidate_years >= required_years:
            # Bonus for extra experience, capped at 100
            bonus = min((candidate_years - required_years) * 5, 20)
            return min(100.0 + bonus, 100.0)
        else:
            # Partial score for less experience
            return (candidate_years / required_years) * 100

    def score(self, resume_data: Dict, job_data: Dict) -> Dict:
        """
        Calculate overall match score

        Args:
            resume_data: Parsed resume data with skills and experience
            job_data: Job requirements with skills and min_experience

        Returns:
            Dict with score details
        """
        candidate_skills = resume_data.get("skills", [])
        required_skills = job_data.get("skills", [])
        candidate_exp = resume_data.get("years_of_experience")
        required_exp = job_data.get("min_experience", 0)

        # Calculate individual scores
        skills_score, matched_skills, missing_skills = self.calculate_skills_score(
            candidate_skills, required_skills
        )
        experience_score = self.calculate_experience_score(candidate_exp, required_exp)

        # Calculate weighted final score
        final_score = (
            skills_score * self.skills_weight +
            experience_score * self.experience_weight
        )

        # Build explanation
        explanation_parts = []

        if matched_skills:
            explanation_parts.append(f"Matched skills: {', '.join(matched_skills)}")
        if missing_skills:
            explanation_parts.append(f"Missing skills: {', '.join(missing_skills)}")

        if candidate_exp is not None:
            if candidate_exp >= required_exp:
                explanation_parts.append(
                    f"Experience: {candidate_exp} years (meets {required_exp}+ requirement)"
                )
            else:
                explanation_parts.append(
                    f"Experience: {candidate_exp} years (below {required_exp} years required)"
                )
        else:
            explanation_parts.append("Experience: Not specified in resume")

        return {
            "final_score": round(final_score, 2),
            "score_breakdown": {
                "skills": round(skills_score, 2),
                "experience": round(experience_score, 2)
            },
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "explanation": ". ".join(explanation_parts)
        }


# Singleton instance
scorer = Scorer()
