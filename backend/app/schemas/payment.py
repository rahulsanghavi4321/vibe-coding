from typing import Optional
import datetime
from pydantic import BaseModel

class CreatePaymentOrderRequest(BaseModel):
    booking_id: int
    amount: float

class VerifyPaymentRequest(BaseModel):
    booking_id: int
    order_id: str
    payment_id: str
    signature: str
    payment_method: Optional[str] = "upi"

class PaymentResponse(BaseModel):
    payment_ref: str
    invoice_number: str
    amount: float
    status: str
    paid_at: datetime.datetime

