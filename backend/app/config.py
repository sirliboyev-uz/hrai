from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://hrai_user:hrai_password@localhost:5432/hrai"

    # Security
    secret_key: str = "your-super-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # File uploads
    upload_dir: str = "./uploads/resumes"
    max_file_size: int = 5 * 1024 * 1024  # 5MB
    allowed_extensions: list = ["pdf", "doc", "docx"]

    # OpenAI
    openai_api_key: Optional[str] = None

    # Server
    debug: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
