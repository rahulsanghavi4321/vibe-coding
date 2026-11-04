import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.database.connection import get_db
from app.models.user import User, Customer, ServiceProvider, Technician
from app.models.category import Service
from app.models.booking import Booking, BookingAssignment, BookingStatusHistory
from app.models.operational import AvailabilitySlot, Notification
from app.schemas.booking import (
    BookingCreateRequest, 
    BookingStatusUpdateRequest, 
    BookingCancelRequest, 
    BookingAssignRequest,
    BookingResponse
)
from app.core.permissions import get_current_user, require_role

router = APIRouter(prefix="/bookings", tags=["Bookings Workflow Engine"])

def generate_booking_ref():
    return f"HS-BK-{uuid.uuid4().hex[:8].upper()}"

@router.get("", response_model=List[BookingResponse])
def get_all_bookings(
    limit: int = 50,
    db: Session = Depends(get_db),
    user = Depends(require_role(["super_admin"]))
):
    bookings = db.query(Booking).order_by(Booking.created_at.desc()).limit(limit).all()
    results = []
    for b in bookings:
        results.append({
            "id": b.id,
            "booking_ref": b.booking_ref,
            "customer_id": b.customer_id,
            "provider_id": b.provider_id,
            "service_id": b.service_id,
            "booking_date": b.booking_date,
            "time_slot": b.time_slot,
            "status": b.status,
            "base_price": b.base_price,
            "tax_amount": b.tax_amount,
            "discount_amount": b.discount_amount,
            "total_amount": b.total_amount,
            "problem_description": b.problem_description,
            "service_title": b.service.title if b.service else None,
            "provider_name": b.provider.business_name if b.provider else None,
            "customer_name": b.customer.user.full_name if b.customer and b.customer.user else None,
            "customer_phone": b.customer.user.phone if b.customer and b.customer.user else None,
            "technician_name": b.assignment.technician.user.full_name if b.assignment and b.assignment.technician and b.assignment.technician.user else "Unassigned",
            "address": f"{b.address.address_line1}, {b.address.city}" if b.address else "Address on file",
            "created_at": b.created_at,
        })
    return results

@router.get("/customer/my-bookings")
def get_customer_bookings(
    current_user: User = Depends(require_role(["customer", "super_admin"])),
    db: Session = Depends(get_db)
):
    if not current_user.customer_profile and current_user.role != "super_admin":
        return []

    cust_id = current_user.customer_profile.id if current_user.customer_profile else 1
    bookings = db.query(Booking).filter(Booking.customer_id == cust_id).order_by(Booking.created_at.desc()).all()
    
    results = []
    for b in bookings:
        results.append({
            "id": b.id,
            "booking_ref": b.booking_ref,
            "service_title": b.service.title if b.service else "Home Service",
            "provider_name": b.provider.business_name if b.provider else "Apex Services",
            "booking_date": str(b.booking_date),
            "time_slot": b.time_slot,
            "total_amount": b.total_amount,
            "status": b.status,
            "payment_status": b.payment.status if b.payment else "Pending",
            "technician_name": b.assignment.technician.user.full_name if b.assignment and b.assignment.technician and b.assignment.technician.user else "Assigning soon",
            "address": f"{b.address.address_line1}, {b.address.city}" if b.address else "Address on file",
            "created_at": str(b.created_at),
        })
    return results

@router.get("/provider/requests")
def get_provider_booking_requests(
    current_user: User = Depends(require_role(["service_provider", "super_admin"])),
    db: Session = Depends(get_db)
):
    provider_id = current_user.provider_profile.id if current_user.provider_profile else 1
    bookings = db.query(Booking).filter(Booking.provider_id == provider_id).order_by(Booking.created_at.desc()).all()
    
    results = []
    for b in bookings:
        results.append({
            "id": b.id,
            "booking_ref": b.booking_ref,
            "service_title": b.service.title if b.service else "Home Service",
            "customer_name": b.customer.user.full_name if b.customer and b.customer.user else "Customer",
            "customer_phone": b.customer.user.phone if b.customer and b.customer.user else "",
            "booking_date": str(b.booking_date),
            "time_slot": b.time_slot,
            "total_amount": b.total_amount,
            "status": b.status,
            "address": f"{b.address.address_line1}, {b.address.city}" if b.address else "Address on file",
            "problem_description": b.problem_description,
            "technician_name": b.assignment.technician.user.full_name if b.assignment and b.assignment.technician and b.assignment.technician.user else None,
        })
    return results

@router.post("", status_code=status.HTTP_201_CREATED)
def create_booking(
    request: BookingCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Validation: Date must be today or future
    today = datetime.date.today()
    if request.booking_date < today:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking date cannot be in the past."
        )

    # 2. Validation: Customer profile
    if not current_user.customer_profile:
        cust = Customer(user_id=current_user.id)
        db.add(cust)
        db.flush()
    else:
        cust = current_user.customer_profile

    # 3. Validation: Provider exists and is verified
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == request.provider_id).first()
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service provider not found.")
    
    if not provider.is_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Provider is currently not accepting new bookings."
        )

    # 4. Anti-Double-Booking / Capacity Check inside Transaction
    # Check existing active bookings for this provider at this date and time slot
    existing_count = db.query(Booking).filter(
        and_(
            Booking.provider_id == request.provider_id,
            Booking.booking_date == request.booking_date,
            Booking.time_slot == request.time_slot,
            Booking.status.notin_(["Cancelled", "Rejected"])
        )
    ).count()

    # Provider max concurrent capacity based on active technicians
    tech_count = db.query(Technician).filter(
        Technician.provider_id == request.provider_id,
        Technician.status == "active"
    ).count()
    max_capacity = max(1, tech_count)

    if existing_count >= max_capacity:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"This time slot ({request.time_slot}) is already fully booked for this provider. Please select another slot."
        )

    # 5. Create Booking Entity
    booking_ref = generate_booking_ref()
    booking = Booking(
        booking_ref=booking_ref,
        customer_id=cust.id,
        provider_id=request.provider_id,
        service_id=request.service_id,
        address_id=request.address_id,
        booking_date=request.booking_date,
        time_slot=request.time_slot,
        status="Pending",
        base_price=request.base_price,
        tax_amount=request.tax_amount,
        discount_amount=request.discount_amount,
        total_amount=request.total_amount,
        problem_description=request.problem_description
    )
    db.add(booking)
    db.flush()

    # 6. Audit Trail History
    history = BookingStatusHistory(
        booking_id=booking.id,
        previous_status=None,
        new_status="Pending",
        changed_by_user_id=current_user.id,
        notes="Customer confirmed appointment request."
    )
    db.add(history)

    # 7. Notify Provider
    if provider.user_id:
        notif = Notification(
            user_id=provider.user_id,
            title="New Booking Request",
            message=f"New booking {booking_ref} received for {request.booking_date} ({request.time_slot}).",
            event_type="booking_created",
            reference_id=booking_ref
        )
        db.add(notif)

    db.commit()
    db.refresh(booking)

    return {
        "id": booking.id,
        "booking_ref": booking.booking_ref,
        "status": booking.status,
        "total_amount": booking.total_amount,
        "message": "Appointment created successfully."
    }

@router.post("/{booking_id}/assign")
def assign_technician_to_booking(
    booking_id: int,
    request: BookingAssignRequest,
    current_user: User = Depends(require_role(["service_provider", "super_admin"])),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    technician = db.query(Technician).filter(Technician.id == request.technician_id).first()
    if not technician:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Technician not found.")

    # Concurrency check: Ensure technician is not assigned to an overlapping active booking
    overlapping_assignment = db.query(BookingAssignment).join(Booking).filter(
        and_(
            BookingAssignment.technician_id == request.technician_id,
            Booking.booking_date == booking.booking_date,
            Booking.time_slot == booking.time_slot,
            Booking.status.in_(["Confirmed", "Provider Assigned", "In Progress"]),
            Booking.id != booking.id
        )
    ).first()

    if overlapping_assignment:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Technician {technician.user.full_name if technician.user else ''} is already committed to an overlapping job in this slot ({booking.time_slot})."
        )

    # Create or update assignment
    if booking.assignment:
        booking.assignment.technician_id = request.technician_id
        booking.assignment.assigned_at = datetime.datetime.utcnow()
    else:
        assignment = BookingAssignment(
            booking_id=booking.id,
            technician_id=request.technician_id,
            assigned_by=current_user.id
        )
        db.add(assignment)

    old_status = booking.status
    booking.status = "Provider Assigned"

    # Status History
    hist = BookingStatusHistory(
        booking_id=booking.id,
        previous_status=old_status,
        new_status="Provider Assigned",
        changed_by_user_id=current_user.id,
        notes=f"Dispatched technician {technician.user.full_name if technician.user else ''}"
    )
    db.add(hist)

    # Notify Customer & Technician
    if booking.customer and booking.customer.user_id:
        notif = Notification(
            user_id=booking.customer.user_id,
            title="Technician Assigned",
            message=f"Technician {technician.user.full_name if technician.user else 'Professional'} has been assigned to your booking {booking.booking_ref}.",
            event_type="technician_assigned",
            reference_id=booking.booking_ref
        )
        db.add(notif)

    if technician.user_id:
        tech_notif = Notification(
            user_id=technician.user_id,
            title="New Job Assignment",
            message=f"You have been assigned job {booking.booking_ref} on {booking.booking_date} ({booking.time_slot}).",
            event_type="job_assigned",
            reference_id=booking.booking_ref
        )
        db.add(tech_notif)

    db.commit()
    return {"message": "Technician dispatched successfully.", "status": booking.status}

@router.patch("/{booking_id}/status")
def update_booking_status(
    booking_id: int,
    request: BookingStatusUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    old_status = booking.status
    booking.status = request.status

    hist = BookingStatusHistory(
        booking_id=booking.id,
        previous_status=old_status,
        new_status=request.status,
        changed_by_user_id=current_user.id,
        notes=request.notes or f"Updated status to {request.status}"
    )
    db.add(hist)
    db.commit()
    db.refresh(booking)

    return {"id": booking.id, "status": booking.status}

@router.patch("/{booking_id}/cancel")
def cancel_booking(
    booking_id: int,
    request: BookingCancelRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    if booking.status in ["In Progress", "Completed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel a service that is already in progress or completed."
        )

    old_status = booking.status
    booking.status = "Cancelled"
    booking.cancellation_reason = request.reason

    hist = BookingStatusHistory(
        booking_id=booking.id,
        previous_status=old_status,
        new_status="Cancelled",
        changed_by_user_id=current_user.id,
        notes=f"Cancelled: {request.reason}"
    )
    db.add(hist)
    db.commit()

    return {"id": booking.id, "status": "Cancelled", "message": "Booking cancelled successfully."}
