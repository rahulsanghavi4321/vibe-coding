from typing import List, Optional
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import Technician, User, ServiceProvider
from app.models.booking import Booking, BookingAssignment, BookingStatusHistory
from app.core.security import get_password_hash
from app.core.permissions import get_current_user, require_role

router = APIRouter(prefix="/technicians", tags=["Technicians"])

class TechnicianCreateRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    specialization: Optional[str] = "General Trade Specialist"

class JobStatusUpdateRequest(BaseModel):
    status: str
    completion_remarks: Optional[str] = None

@router.get("")
def get_technicians(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # If provider, return their techs; if admin, return all
    if current_user.role == "service_provider" and current_user.provider_profile:
        techs = db.query(Technician).filter(Technician.provider_id == current_user.provider_profile.id).all()
    else:
        techs = db.query(Technician).all()

    results = []
    for t in techs:
        results.append({
            "id": t.id,
            "full_name": t.user.full_name if t.user else "Technician",
            "email": t.user.email if t.user else "",
            "phone": t.user.phone if t.user else "",
            "specialization": t.specialization,
            "status": t.status,
            "is_available": t.is_available,
            "completed_jobs": len([a for a in t.assignments if a.work_completed_time]) if t.assignments else 0,
        })
    return results

@router.post("")
def create_technician(
    request: TechnicianCreateRequest,
    current_user: User = Depends(require_role(["service_provider", "super_admin"])),
    db: Session = Depends(get_db)
):
    if not current_user.provider_profile and current_user.role != "super_admin":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Provider profile not found.")

    provider_id = current_user.provider_profile.id if current_user.provider_profile else 1

    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User email already exists.")

    new_user = User(
        email=request.email,
        password_hash=get_password_hash("Password@123"),
        full_name=request.full_name,
        phone=request.phone,
        role="technician",
        status="active"
    )
    db.add(new_user)
    db.flush()

    new_tech = Technician(
        user_id=new_user.id,
        provider_id=provider_id,
        specialization=request.specialization,
        status="active",
        is_available=True
    )
    db.add(new_tech)
    db.commit()
    db.refresh(new_tech)

    return {
        "id": new_tech.id,
        "full_name": new_user.full_name,
        "email": new_user.email,
        "phone": new_user.phone,
        "specialization": new_tech.specialization,
        "status": new_tech.status,
        "is_available": new_tech.is_available,
    }

@router.get("/me/assigned-jobs")
def get_assigned_jobs(
    current_user: User = Depends(require_role(["technician"])),
    db: Session = Depends(get_db)
):
    tech = current_user.technician_profile
    if not tech:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Technician profile not found.")

    assignments = db.query(BookingAssignment).filter(BookingAssignment.technician_id == tech.id).all()
    results = []
    for a in assignments:
        b = a.booking
        if b:
            results.append({
                "id": b.id,
                "booking_ref": b.booking_ref,
                "service_title": b.service.title if b.service else "Service Job",
                "customer_name": b.customer.user.full_name if b.customer and b.customer.user else "Customer",
                "customer_phone": b.customer.user.phone if b.customer and b.customer.user else "",
                "booking_date": str(b.booking_date),
                "time_slot": b.time_slot,
                "address": f"{b.address.address_line1}, {b.address.city}" if b.address else "Address on file",
                "status": b.status,
                "problem_description": b.problem_description,
            })
    return results

@router.patch("/jobs/{job_id}/status")
def update_job_status(
    job_id: int,
    request: JobStatusUpdateRequest,
    current_user: User = Depends(require_role(["technician", "service_provider", "super_admin"])),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == job_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    old_status = booking.status
    booking.status = request.status

    # Update assignment tracking
    if booking.assignment:
        if request.status == "In Progress":
            booking.assignment.arrival_time = datetime.datetime.utcnow()
            booking.assignment.work_started_time = datetime.datetime.utcnow()
        elif request.status == "Completed":
            booking.assignment.work_completed_time = datetime.datetime.utcnow()
            if request.completion_remarks:
                booking.assignment.completion_remarks = request.completion_remarks

    # Audit history log
    hist = BookingStatusHistory(
        booking_id=booking.id,
        previous_status=old_status,
        new_status=request.status,
        changed_by_user_id=current_user.id,
        notes=request.completion_remarks or f"Status shifted to {request.status}"
    )
    db.add(hist)
    db.commit()
    db.refresh(booking)

    return {"id": booking.id, "status": booking.status, "updated_at": booking.updated_at}

