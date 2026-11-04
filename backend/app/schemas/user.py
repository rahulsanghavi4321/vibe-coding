from typing import Optional
from pydantic import BaseModel

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class AddressCreateRequest(BaseModel):
    title: str = "Home"
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    is_default: bool = False

class AddressResponse(BaseModel):
    id: int
    title: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    is_default: bool

    class Config:
        from_attributes = True

