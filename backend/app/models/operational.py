import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(50), default="Home")
    address_line1 = Column(String(255), nullable=False)
    address_line2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    customer = relationship("Customer", back_populates="addresses")

class ServiceArea(Base):
    __tablename__ = "service_areas"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("service_providers.id", ondelete="CASCADE"), nullable=False, index=True)
    city = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=False)
    radius_km = Column(Float, default=15.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    provider = relationship("ServiceProvider", back_populates="service_areas")

class AvailabilitySlot(Base):
    __tablename__ = "availability_slots"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("service_providers.id", ondelete="CASCADE"), nullable=False, index=True)
    day_of_week = Column(Integer, nullable=False) # 0=Monday ... 6=Sunday
    start_time = Column(String(10), default="09:00")
    end_time = Column(String(10), default="18:00")
    slot_duration_minutes = Column(Integer, default=60)
    is_active = Column(Boolean, default=True)

    provider = relationship("ServiceProvider", back_populates="availability_slots")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    event_type = Column(String(60), nullable=False)
    reference_id = Column(String(60), nullable=True)
    is_read = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class Favourite(Base):
    __tablename__ = "favourites"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    provider_id = Column(Integer, ForeignKey("service_providers.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('customer_id', 'provider_id', name='uq_customer_provider_favourite'),
    )

    customer = relationship("Customer", back_populates="favourites")

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    duration_days = Column(Integer, default=30)
    max_technicians = Column(Integer, default=5)
    features_json = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

class ProviderSubscription(Base):
    __tablename__ = "provider_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("service_providers.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    status = Column(String(20), default="active")

    provider = relationship("ServiceProvider", back_populates="subscriptions")

class AdminAnnouncement(Base):
    __tablename__ = "admin_announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    target_audience = Column(String(30), default="all") # all, customers, providers, technicians
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

