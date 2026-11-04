import hmac
import hashlib
import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.core.config import settings
from app.models.user import User
from app.models.booking import Booking
from app.models.payment import Payment, Invoice, ProviderEarning
from app.models.operational import Notification
from app.schemas.payment import CreatePaymentOrderRequest, VerifyPaymentRequest, PaymentResponse
from app.core.permissions import get_current_user

router = APIRouter(prefix="/payments", tags=["Payment & Settlement Engine"])

@router.post("/create-order")
def create_payment_order(
    request: CreatePaymentOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == request.booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    order_id = f"order_{uuid.uuid4().hex[:14]}"
    
    return {
        "order_id": order_id,
        "amount": request.amount,
        "currency": "INR",
        "key_id": settings.RAZORPAY_KEY_ID,
        "mode": settings.PAYMENT_MODE,
        "booking_ref": booking.booking_ref
    }

@router.post("/verify")
def verify_payment(
    request: VerifyPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == request.booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    # Verification Logic
    if settings.PAYMENT_MODE == "simulation":
        # Dev simulation mode: accept simulated signature
        is_valid = True
    else:
        # Production Razorpay HMAC verification
        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode('utf-8'),
            f"{request.order_id}|{request.payment_id}".encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        is_valid = hmac.compare_digest(generated_signature, request.signature)

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cryptographic payment signature verification failed."
        )

    # Record or update Payment
    payment_ref = f"PAY-{uuid.uuid4().hex[:8].upper()}"
    invoice_number = f"INV-2026-{uuid.uuid4().hex[:6].upper()}"

    existing_payment = db.query(Payment).filter(Payment.booking_id == booking.id).first()
    if existing_payment:
        existing_payment.status = "Paid"
        existing_payment.gateway_order_id = request.order_id
        existing_payment.gateway_payment_id = request.payment_id
        existing_payment.gateway_signature = request.signature
        existing_payment.payment_method = request.payment_method
        existing_payment.paid_at = datetime.datetime.utcnow()
        payment_ref = existing_payment.payment_ref
    else:
        payment = Payment(
            booking_id=booking.id,
            payment_ref=payment_ref,
            gateway="razorpay",
            gateway_order_id=request.order_id,
            gateway_payment_id=request.payment_id,
            gateway_signature=request.signature,
            amount=booking.total_amount,
            status="Paid",
            payment_method=request.payment_method,
            paid_at=datetime.datetime.utcnow()
        )
        db.add(payment)

    # Create Invoice if not present
    existing_inv = db.query(Invoice).filter(Invoice.booking_id == booking.id).first()
    if not existing_inv:
        invoice = Invoice(
            invoice_number=invoice_number,
            booking_id=booking.id,
            customer_name=booking.customer.user.full_name if booking.customer and booking.customer.user else "Customer",
            provider_name=booking.provider.business_name if booking.provider else "HomeServe Provider",
            subtotal=booking.base_price,
            tax_amount=booking.tax_amount,
            discount_amount=booking.discount_amount,
            total_amount=booking.total_amount
        )
        db.add(invoice)
    else:
        invoice_number = existing_inv.invoice_number

    # Calculate Provider Earning & Platform Commission (15%)
    commission_rate = booking.provider.commission_rate if booking.provider else 15.0
    commission_amount = round(booking.base_price * (commission_rate / 100.0), 2)
    net_earning = round(booking.base_price - commission_amount, 2)

    existing_earning = db.query(ProviderEarning).filter(ProviderEarning.booking_id == booking.id).first()
    if not existing_earning and booking.provider_id:
        earning = ProviderEarning(
            provider_id=booking.provider_id,
            booking_id=booking.id,
            gross_amount=booking.base_price,
            commission_rate=commission_rate,
            commission_amount=commission_amount,
            net_amount=net_earning,
            payout_status="Settled",
            settled_at=datetime.datetime.utcnow()
        )
        db.add(earning)

    # Notify Customer
    if booking.customer and booking.customer.user_id:
        notif = Notification(
            user_id=booking.customer.user_id,
            title="Payment Received",
            message=f"Payment of ₹{booking.total_amount:.2f} confirmed for booking {booking.booking_ref}. Invoice {invoice_number} generated.",
            event_type="payment_success",
            reference_id=booking.booking_ref
        )
        db.add(notif)

    db.commit()

    return {
        "payment_ref": payment_ref,
        "invoice_number": invoice_number,
        "amount": booking.total_amount,
        "status": "Paid",
        "paid_at": datetime.datetime.utcnow().isoformat(),
        "message": "Payment verified and invoice generated."
    }
