import re
from typing import Dict, List, Optional
import pdfplumber
from docx import Document


# Common technical skills to detect (expanded list)
SKILLS_DATABASE = [
    # Programming Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust",
    "PHP", "Ruby", "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl",
    "Objective-C", "Dart", "Lua", "Haskell", "Elixir", "Clojure",

    # Web Frameworks & Libraries
    "Django", "FastAPI", "Flask", "React", "Vue", "Angular", "Next.js",
    "Express", "Node.js", "Spring", "Laravel", "Rails", "ASP.NET",
    "Svelte", "Nuxt.js", "Gatsby", "Redux", "MobX", "jQuery",
    "Bootstrap", "Tailwind CSS", "Material UI", "Chakra UI",

    # Mobile Development
    "React Native", "Flutter", "SwiftUI", "Android SDK", "iOS",
    "Xamarin", "Ionic", "Cordova",

    # Databases
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Oracle",
    "Cassandra", "DynamoDB", "Elasticsearch", "MariaDB", "CouchDB",
    "Neo4j", "Firebase", "Supabase", "Prisma", "SQLAlchemy",

    # Cloud & DevOps
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
    "Jenkins", "GitLab CI", "GitHub Actions", "Ansible", "Chef", "Puppet",
    "CircleCI", "Travis CI", "ArgoCD", "Helm", "Prometheus", "Grafana",
    "Nginx", "Apache", "Serverless", "Lambda", "EC2", "S3",

    # Data & ML/AI
    "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
    "Spark", "Hadoop", "Kafka", "Airflow", "Keras", "OpenCV",
    "NLTK", "spaCy", "Hugging Face", "LangChain", "OpenAI",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
    "Data Science", "Data Analysis", "Data Engineering",

    # Testing & QA
    "Jest", "Mocha", "Pytest", "JUnit", "Selenium", "Cypress",
    "Playwright", "Unit Testing", "Integration Testing", "E2E Testing",
    "TDD", "BDD",

    # Other Technologies
    "Git", "Linux", "REST API", "GraphQL", "Microservices", "Agile",
    "Scrum", "CI/CD", "HTML", "CSS", "Sass", "LESS",
    "WebSocket", "gRPC", "RabbitMQ", "WebRTC", "OAuth", "JWT",
    "API Design", "System Design", "Software Architecture",

    # Soft Skills (sometimes listed)
    "Leadership", "Team Management", "Communication", "Problem Solving",
    "Project Management", "Technical Writing",
]


class ResumeParser:
    """Parse resume files and extract structured information"""

    def __init__(self):
        self.skills_lower = {s.lower(): s for s in SKILLS_DATABASE}

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            with pdfplumber.open(file_path) as pdf:
                text_parts = []
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
                return "\n".join(text_parts)
        except Exception as e:
            print(f"Error extracting PDF text: {e}")
            return ""

    def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            return "\n".join(paragraph.text for paragraph in doc.paragraphs)
        except Exception as e:
            print(f"Error extracting DOCX text: {e}")
            return ""

    def extract_text(self, file_path: str) -> str:
        """Extract text from resume file based on extension"""
        file_path_lower = file_path.lower()
        if file_path_lower.endswith('.pdf'):
            return self.extract_text_from_pdf(file_path)
        elif file_path_lower.endswith('.docx') or file_path_lower.endswith('.doc'):
            return self.extract_text_from_docx(file_path)
        return ""

    def extract_email(self, text: str) -> Optional[str]:
        """Extract email address from text"""
        pattern = r'[\w\.-]+@[\w\.-]+\.\w+'
        match = re.search(pattern, text)
        return match.group() if match else None

    def extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number from text"""
        patterns = [
            r'\+?[\d\s\-\(\)]{10,}',
            r'\(\d{3}\)\s*\d{3}[-\s]?\d{4}',
            r'\d{3}[-\s]?\d{3}[-\s]?\d{4}'
        ]
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                phone = match.group().strip()
                # Clean up and validate length
                digits = re.sub(r'\D', '', phone)
                if len(digits) >= 9:
                    return phone
        return None

    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text"""
        text_lower = text.lower()
        found_skills = []

        for skill_lower, skill_original in self.skills_lower.items():
            # Use word boundary matching for accurate detection
            pattern = r'\b' + re.escape(skill_lower) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill_original)

        return list(set(found_skills))

    def extract_years_of_experience(self, text: str) -> Optional[int]:
        """Extract years of experience from text"""
        patterns = [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
            r'(\d+)\+?\s*years?\s+(?:of\s+)?(?:professional\s+)?experience',
            r'experience\s*[:\-]?\s*(\d+)\s*years?',
            r'(\d+)\+?\s*(?:years?|yrs?)\s+(?:in|of|working)',
        ]

        for pattern in patterns:
            match = re.search(pattern, text.lower())
            if match:
                years = int(match.group(1))
                # Sanity check - max 50 years
                if 0 < years <= 50:
                    return years

        return None

    def extract_name(self, text: str) -> Optional[str]:
        """Try to extract name from first lines of resume"""
        lines = text.strip().split('\n')
        for line in lines[:5]:  # Check first 5 lines
            line = line.strip()
            # Skip if line contains common headers or has email/phone
            if '@' in line or re.search(r'\d{5,}', line):
                continue
            if len(line) < 50 and len(line.split()) <= 4:
                # Looks like a name
                words = line.split()
                if len(words) >= 2:
                    # Check if words look like names (start with capital)
                    if all(w[0].isupper() for w in words if w):
                        return line
        return None

    def parse(self, file_path: str) -> Dict:
        """Parse resume and extract all information"""
        text = self.extract_text(file_path)

        if not text:
            return {
                "raw_text": "",
                "email": None,
                "phone": None,
                "name": None,
                "skills": [],
                "years_of_experience": None,
                "error": "Could not extract text from file"
            }

        return {
            "raw_text": text[:5000],  # Limit stored text
            "email": self.extract_email(text),
            "phone": self.extract_phone(text),
            "name": self.extract_name(text),
            "skills": self.extract_skills(text),
            "years_of_experience": self.extract_years_of_experience(text)
        }


# Singleton instance
resume_parser = ResumeParser()
