import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(191), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    phone = Column(String(30), unique=True, nullable=True)
    role = Column(String(30), default="customer", nullable=False) # super_admin, customer, service_provider, technician
    status = Column(String(20), default="active", nullable=False) # active, inactive, suspended
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    customer_profile = relationship("Customer", back_populates="user", uselist=False, cascade="all, delete-orphan")
    provider_profile = relationship("ServiceProvider", back_populates="user", uselist=False, cascade="all, delete-orphan")
    technician_profile = relationship("Technician", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    emergency_contact = Column(String(30), nullable=True)
    preferred_language = Column(String(20), default="en")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="customer_profile")
    addresses = relationship("Address", back_populates="customer", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="customer")
    reviews = relationship("Review", back_populates="customer")
    complaints = relationship("Complaint", back_populates="customer")
    favourites = relationship("Favourite", back_populates="customer", cascade="all, delete-orphan")

class ServiceProvider(Base):
    __tablename__ = "service_providers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    business_name = Column(String(200), nullable=False)
    business_registration_number = Column(String(100), nullable=True)
    tax_id = Column(String(100), nullable=True)
    business_bio = Column(Text, nullable=True)
    logo_url = Column(String(500), nullable=True)
    banner_url = Column(String(500), nullable=True)
    verification_status = Column(String(20), default="pending", nullable=False) # pending, verified, rejected
    verification_document_url = Column(String(500), nullable=True)
    rejection_reason = Column(Text, nullable=True)
    commission_rate = Column(Float, default=15.0)
    rating_avg = Column(Float, default=5.0)
    rating_count = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="provider_profile")
    technicians = relationship("Technician", back_populates="provider", cascade="all, delete-orphan")
    provider_services = relationship("ProviderService", back_populates="provider", cascade="all, delete-orphan")
    service_areas = relationship("ServiceArea", back_populates="provider", cascade="all, delete-orphan")
    availability_slots = relationship("AvailabilitySlot", back_populates="provider", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="provider")
    earnings = relationship("ProviderEarning", back_populates="provider", cascade="all, delete-orphan")
    subscriptions = relationship("ProviderSubscription", back_populates="provider", cascade="all, delete-orphan")

class Technician(Base):
    __tablename__ = "technicians"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    provider_id = Column(Integer, ForeignKey("service_providers.id", ondelete="CASCADE"), nullable=False, index=True)
    specialization = Column(String(150), nullable=True)
    id_proof_url = Column(String(500), nullable=True)
    status = Column(String(20), default="active", nullable=False) # active, inactive, on_leave
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="technician_profile")
    provider = relationship("ServiceProvider", back_populates="technicians")
    assignments = relationship("BookingAssignment", back_populates="technician")

