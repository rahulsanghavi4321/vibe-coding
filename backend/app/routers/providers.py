import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import ServiceProvider, User
from app.core.permissions import get_current_user, require_role

router = APIRouter(prefix="/providers", tags=["Providers"])

@router.get("")
def list_providers(db: Session = Depends(get_db)):
    providers = db.query(ServiceProvider).all()
    results = []
    for p in providers:
        results.append({
            "id": p.id,
            "business_name": p.business_name,
            "owner_name": p.user.full_name if p.user else "Agency Owner",
            "tax_id": p.tax_id,
            "verification_status": p.verification_status,
            "rating_avg": p.rating_avg,
            "rating_count": p.rating_count,
            "commission_rate": p.commission_rate,
            "technicians_count": len(p.technicians) if p.technicians else 0,
            "is_available": p.is_available,
        })
    return results

@router.get("/me/overview")
def get_my_provider_overview(
    current_user: User = Depends(require_role(["service_provider"])), 
    db: Session = Depends(get_db)
):
    provider = current_user.provider_profile
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Provider profile not found.")

    bookings = provider.bookings or []
    completed = [b for b in bookings if b.status == "Completed"]
    pending = [b for b in bookings if b.status == "Pending"]
    accepted = [b for b in bookings if b.status in ["Confirmed", "Provider Assigned", "In Progress"]]

    gross = sum(b.total_amount for b in completed)
    commission = gross * (provider.commission_rate / 100.0)
    net = gross - commission

    return {
        "total_bookings": len(bookings),
        "today_bookings": len([b for b in bookings if str(b.booking_date) == str(datetime.date.today())]) if hasattr(datetime, 'date') else 2,
        "pending_requests": len(pending),
        "accepted_bookings": len(accepted),
        "completed_services": len(completed),
        "gross_earnings": round(gross, 2),
        "platform_commission": round(commission, 2),
        "net_earnings": round(net, 2),
        "rating_avg": provider.rating_avg,
        "rating_count": provider.rating_count,
        "technicians_count": len(provider.technicians) if provider.technicians else 0,
    }

