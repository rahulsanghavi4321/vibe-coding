import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), unique=True, nullable=False)
    payment_ref = Column(String(100), unique=True, index=True, nullable=False)
    gateway = Column(String(50), default="razorpay")
    gateway_order_id = Column(String(120), nullable=True)
    gateway_payment_id = Column(String(120), nullable=True)
    gateway_signature = Column(String(255), nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    status = Column(String(20), default="Pending", nullable=False) # Pending, Paid, Failed, Refunded
    payment_method = Column(String(50), nullable=True) # upi, card, netbanking
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    booking = relationship("Booking", back_populates="payment")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(60), unique=True, index=True, nullable=False)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), unique=True, nullable=False)
    customer_name = Column(String(150), nullable=False)
    provider_name = Column(String(200), nullable=False)
    subtotal = Column(Float, nullable=False)
    tax_amount = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    pdf_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    booking = relationship("Booking", back_populates="invoice")

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(40), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    discount_type = Column(String(20), default="fixed") # fixed, percentage
    discount_value = Column(Float, nullable=False)
    min_order_amount = Column(Float, default=0.0)
    max_discount = Column(Float, nullable=True)
    valid_until = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ProviderEarning(Base):
    __tablename__ = "provider_earnings"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("service_providers.id", ondelete="CASCADE"), nullable=False, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True, nullable=False)
    gross_amount = Column(Float, nullable=False)
    commission_rate = Column(Float, default=15.0)
    commission_amount = Column(Float, nullable=False)
    net_amount = Column(Float, nullable=False)
    payout_status = Column(String(20), default="Pending") # Pending, Settled
    settled_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    provider = relationship("ServiceProvider", back_populates="earnings")

