import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, Float, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_ref = Column(String(60), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    provider_id = Column(Integer, ForeignKey("service_providers.id"), nullable=False, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False, index=True)
    address_id = Column(Integer, ForeignKey("addresses.id"), nullable=True)

    booking_date = Column(Date, nullable=False, index=True)
    time_slot = Column(String(30), nullable=False)
    status = Column(
        String(30), 
        default="Pending", 
        nullable=False, 
        index=True
    ) # Pending, Confirmed, Provider Assigned, In Progress, Completed, Cancelled, Rejected

    base_price = Column(Float, nullable=False)
    additional_charges = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)

    problem_description = Column(Text, nullable=True)
    cancellation_reason = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="bookings")
    provider = relationship("ServiceProvider", back_populates="bookings")
    service = relationship("Service", back_populates="bookings")
    address = relationship("Address")
    
    assignment = relationship("BookingAssignment", back_populates="booking", uselist=False, cascade="all, delete-orphan")
    images = relationship("BookingImage", back_populates="booking", cascade="all, delete-orphan")
    status_history = relationship("BookingStatusHistory", back_populates="booking", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="booking", uselist=False, cascade="all, delete-orphan")
    invoice = relationship("Invoice", back_populates="booking", uselist=False, cascade="all, delete-orphan")
    review = relationship("Review", back_populates="booking", uselist=False)
    complaints = relationship("Complaint", back_populates="booking")

class BookingAssignment(Base):
    __tablename__ = "booking_assignments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), unique=True, nullable=False)
    technician_id = Column(Integer, ForeignKey("technicians.id"), nullable=False, index=True)
    assigned_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    technician_acknowledged = Column(Boolean, default=False)
    arrival_time = Column(DateTime, nullable=True)
    work_started_time = Column(DateTime, nullable=True)
    work_completed_time = Column(DateTime, nullable=True)
    completion_remarks = Column(Text, nullable=True)

    booking = relationship("Booking", back_populates="assignment")
    technician = relationship("Technician", back_populates="assignments")

class BookingImage(Base):
    __tablename__ = "booking_images"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, index=True)
    image_type = Column(String(30), nullable=False) # customer_reference, before_service, after_service
    image_url = Column(String(500), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    booking = relationship("Booking", back_populates="images")

class BookingStatusHistory(Base):
    __tablename__ = "booking_status_history"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, index=True)
    previous_status = Column(String(30), nullable=True)
    new_status = Column(String(30), nullable=False)
    changed_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    booking = relationship("Booking", back_populates="status_history")

