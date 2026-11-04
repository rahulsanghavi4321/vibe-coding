from typing import Optional
import datetime
from pydantic import BaseModel

class BookingCreateRequest(BaseModel):
    provider_id: int
    service_id: int
    address_id: Optional[int] = None
    booking_date: datetime.date
    time_slot: str
    problem_description: Optional[str] = None
    base_price: float
    tax_amount: float = 0.0
    discount_amount: float = 0.0
    total_amount: float

class BookingStatusUpdateRequest(BaseModel):
    status: str
    notes: Optional[str] = None
    completion_remarks: Optional[str] = None

class BookingCancelRequest(BaseModel):
    reason: Optional[str] = "Cancelled by user"

class BookingAssignRequest(BaseModel):
    technician_id: int

class BookingResponse(BaseModel):
    id: int
    booking_ref: str
    customer_id: int
    provider_id: int
    service_id: int
    booking_date: datetime.date
    time_slot: str
    status: str
    base_price: float
    tax_amount: float
    discount_amount: float
    total_amount: float
    problem_description: Optional[str] = None
    service_title: Optional[str] = None
    provider_name: Optional[str] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    technician_name: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

