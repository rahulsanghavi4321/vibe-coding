from typing import Optional
from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: str = "customer" # customer, service_provider
    # Provider specific
    business_name: Optional[str] = None
    tax_id: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    status: str

    class Config:
        from_attributes = True

