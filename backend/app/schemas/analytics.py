from typing import List, Optional
from pydantic import BaseModel

class AdminMetricsResponse(BaseModel):
    total_customers: int
    total_providers: int
    total_technicians: int
    total_bookings: int
    pending_bookings: int
    completed_bookings: int
    cancelled_bookings: int
    total_revenue: float
    platform_commission: float
    pending_verifications: int
    open_complaints: int

class ProviderMetricsResponse(BaseModel):
    total_bookings: int
    today_bookings: int
    pending_requests: int
    accepted_bookings: int
    completed_services: int
    gross_earnings: float
    platform_commission: float
    net_earnings: float
    rating_avg: float
    rating_count: int
    technicians_count: int
