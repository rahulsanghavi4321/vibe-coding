import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.feedback import Complaint, ComplaintHistory
from app.models.booking import Booking
from app.models.user import User
from app.schemas.feedback import ComplaintCreateRequest, ComplaintStatusUpdateRequest
from app.core.permissions import get_current_user, require_role

router = APIRouter(prefix="/complaints", tags=["Complaints & Disputes"])

@router.get("")
def list_complaints(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "super_admin":
        complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).all()
    elif current_user.customer_profile:
        complaints = db.query(Complaint).filter(Complaint.customer_id == current_user.customer_profile.id).all()
    else:
        complaints = []

    results = []
    for c in complaints:
        results.append({
            "id": c.id,
            "ticket_number": c.ticket_number,
            "booking_ref": c.booking.booking_ref if c.booking else "",
            "customer_name": c.customer.user.full_name if c.customer and c.customer.user else "Customer",
            "provider_name": c.booking.provider.business_name if c.booking and c.booking.provider else "Agency",
            "subject": c.subject,
            "description": c.description,
            "status": c.status,
            "resolution_remarks": c.resolution_remarks,
            "created_at": str(c.created_at),
        })
    return results

@router.post("")
def create_complaint(
    request: ComplaintCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == request.booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    if not current_user.customer_profile:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only customers can file disputes.")

    ticket_number = f"TCK-2026-{uuid.uuid4().hex[:6].upper()}"
    complaint = Complaint(
        ticket_number=ticket_number,
        booking_id=booking.id,
        customer_id=current_user.customer_profile.id,
        subject=request.subject,
        description=request.description,
        status="Open"
    )
    db.add(complaint)
    db.flush()

    # Log History
    hist = ComplaintHistory(
        complaint_id=complaint.id,
        previous_status=None,
        new_status="Open",
        remarks="Customer filed formal dispute under 30-day guarantee.",
        updated_by_user_id=current_user.id
    )
    db.add(hist)
    db.commit()
    db.refresh(complaint)

    return {"id": complaint.id, "ticket_number": complaint.ticket_number, "status": complaint.status}

@router.patch("/{complaint_id}/status")
def update_complaint_status(
    complaint_id: int,
    request: ComplaintStatusUpdateRequest,
    current_user: User = Depends(require_role(["super_admin"])),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found.")

    old_status = complaint.status
    complaint.status = request.status
    if request.resolution_remarks:
        complaint.resolution_remarks = request.resolution_remarks

    hist = ComplaintHistory(
        complaint_id=complaint.id,
        previous_status=old_status,
        new_status=request.status,
        remarks=request.resolution_remarks or f"Administrative adjudication to {request.status}",
        updated_by_user_id=current_user.id
    )
    db.add(hist)
    db.commit()

    return {"id": complaint.id, "status": complaint.status, "message": "Dispute status updated."}
