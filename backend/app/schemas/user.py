from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime


# Request schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    company_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Response schemas
class UserResponse(BaseModel):
    id: UUID
    email: str
    company_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
