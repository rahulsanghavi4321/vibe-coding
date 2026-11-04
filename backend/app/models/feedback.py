import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    provider_id = Column(Integer, ForeignKey("service_providers.id"), nullable=False, index=True)
    rating = Column(Integer, nullable=False) # 1 - 5
    comment = Column(Text, nullable=True)
    provider_reply = Column(Text, nullable=True)
    replied_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    booking = relationship("Booking", back_populates="review")
    customer = relationship("Customer", back_populates="reviews")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    ticket_number = Column(String(50), unique=True, index=True, nullable=False)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    subject = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    attachment_url = Column(String(500), nullable=True)
    status = Column(
        String(30), 
        default="Open", 
        nullable=False, 
        index=True
    ) # Open, Under Review, In Progress, Resolved, Closed
    resolution_remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    booking = relationship("Booking", back_populates="complaints")
    customer = relationship("Customer", back_populates="complaints")
    history = relationship("ComplaintHistory", back_populates="complaint", cascade="all, delete-orphan")

class ComplaintHistory(Base):
    __tablename__ = "complaint_history"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False, index=True)
    previous_status = Column(String(30), nullable=True)
    new_status = Column(String(30), nullable=False)
    remarks = Column(Text, nullable=True)
    updated_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="history")

