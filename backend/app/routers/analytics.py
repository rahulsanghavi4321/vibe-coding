from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.connection import get_db
from app.models.user import User, Customer, ServiceProvider, Technician
from app.models.booking import Booking
from app.models.payment import Payment
from app.models.feedback import Complaint
from app.schemas.analytics import AdminMetricsResponse
from app.core.permissions import require_role

router = APIRouter(prefix="/analytics", tags=["Analytics & Reports"])

@router.get("/admin/overview", response_model=AdminMetricsResponse)
def get_admin_overview(
    user: User = Depends(require_role(["super_admin"])),
    db: Session = Depends(get_db)
):
    # Live SQL aggregation queries
    total_customers = db.query(func.count(Customer.id)).scalar() or 0
    total_providers = db.query(func.count(ServiceProvider.id)).scalar() or 0
    total_technicians = db.query(func.count(Technician.id)).scalar() or 0
    total_bookings = db.query(func.count(Booking.id)).scalar() or 0

    pending_bookings = db.query(func.count(Booking.id)).filter(Booking.status == "Pending").scalar() or 0
    completed_bookings = db.query(func.count(Booking.id)).filter(Booking.status == "Completed").scalar() or 0
    cancelled_bookings = db.query(func.count(Booking.id)).filter(Booking.status == "Cancelled").scalar() or 0

    total_revenue = db.query(func.sum(Booking.total_amount)).filter(Booking.status == "Completed").scalar() or 0.0
    platform_commission = round(float(total_revenue) * 0.15, 2)

    pending_verifications = db.query(func.count(ServiceProvider.id)).filter(ServiceProvider.verification_status == "pending").scalar() or 0
    open_complaints = db.query(func.count(Complaint.id)).filter(Complaint.status.in_(["Open", "Under Review", "In Progress"])).scalar() or 0

    return {
        "total_customers": total_customers,
        "total_providers": total_providers,
        "total_technicians": total_technicians,
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "completed_bookings": completed_bookings,
        "cancelled_bookings": cancelled_bookings,
        "total_revenue": round(float(total_revenue), 2),
        "platform_commission": platform_commission,
        "pending_verifications": pending_verifications,
        "open_complaints": open_complaints,
    }
