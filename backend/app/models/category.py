import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.connection import Base

class ServiceCategory(Base):
    __tablename__ = "service_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    subcategories = relationship("ServiceSubcategory", back_populates="category", cascade="all, delete-orphan")

class ServiceSubcategory(Base):
    __tablename__ = "service_subcategories"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("service_categories.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(120), nullable=False)
    slug = Column(String(150), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    category = relationship("ServiceCategory", back_populates="subcategories")
    services = relationship("Service", back_populates="subcategory", cascade="all, delete-orphan")

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    subcategory_id = Column(Integer, ForeignKey("service_subcategories.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(220), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    base_price = Column(Float, nullable=False)
    duration_minutes = Column(Integer, default=60)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    subcategory = relationship("ServiceSubcategory", back_populates="services")
    provider_services = relationship("ProviderService", back_populates="service", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="service")

class ProviderService(Base):
    __tablename__ = "provider_services"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("service_providers.id", ondelete="CASCADE"), nullable=False, index=True)
    service_id = Column(Integer, ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True)
    custom_price = Column(Float, nullable=True)
    is_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('provider_id', 'service_id', name='uq_provider_service'),
    )

    provider = relationship("ServiceProvider", back_populates="provider_services")
    service = relationship("Service", back_populates="provider_services")

