from typing import Optional
from pydantic import BaseModel

class ReviewCreateRequest(BaseModel):
    booking_id: int
    rating: int
    comment: Optional[str] = None

class ComplaintCreateRequest(BaseModel):
    booking_id: int
    subject: str
    description: str

class ComplaintStatusUpdateRequest(BaseModel):
    status: str
    resolution_remarks: Optional[str] = None

