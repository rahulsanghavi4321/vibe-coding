import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.connection import get_db
from app.models.feedback import Review
from app.models.booking import Booking
from app.models.user import User, ServiceProvider
from app.schemas.feedback import ReviewCreateRequest
from app.core.permissions import get_current_user, require_role

router = APIRouter(prefix="/reviews", tags=["Reviews & Ratings"])

class ReviewReplyRequest(BaseModel):
    reply: str

@router.post("")
def submit_review(
    request: ReviewCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == request.booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    if booking.status != "Completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can only review services after they have been marked Completed."
        )

    # Prevent duplicate review
    existing_rev = db.query(Review).filter(Review.booking_id == booking.id).first()
    if existing_rev:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A review has already been submitted for this booking."
        )

    if not current_user.customer_profile:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only customers can submit reviews.")

    review = Review(
        booking_id=booking.id,
        customer_id=current_user.customer_profile.id,
        provider_id=booking.provider_id,
        rating=max(1, min(5, request.rating)),
        comment=request.comment
    )
    db.add(review)

    # Recalculate provider average rating
    if booking.provider_id:
        prov = db.query(ServiceProvider).filter(ServiceProvider.id == booking.provider_id).first()
        if prov:
            prov.rating_count += 1
            avg_rating = db.query(func.avg(Review.rating)).filter(Review.provider_id == prov.id).scalar() or 5.0
            prov.rating_avg = round(float(avg_rating), 2)

    db.commit()
    db.refresh(review)

    return {"id": review.id, "rating": review.rating, "message": "Review submitted successfully."}

@router.post("/{review_id}/reply")
def reply_to_review(
    review_id: int,
    request: ReviewReplyRequest,
    current_user: User = Depends(require_role(["service_provider", "super_admin"])),
    db: Session = Depends(get_db)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found.")

    review.provider_reply = request.reply
    review.replied_at = datetime.datetime.utcnow()
    db.commit()

    return {"id": review.id, "reply": review.provider_reply}
