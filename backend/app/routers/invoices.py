from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.payment import Invoice
from app.models.user import User
from app.core.permissions import get_current_user

router = APIRouter(prefix="/invoices", tags=["Invoices"])

@router.get("")
def list_invoices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "super_admin":
        invoices = db.query(Invoice).order_by(Invoice.created_at.desc()).all()
    elif current_user.customer_profile:
        invoices = db.query(Invoice).join(Invoice.booking).filter(Invoice.booking.has(customer_id=current_user.customer_profile.id)).all()
    else:
        invoices = []

    results = []
    for inv in invoices:
        results.append({
            "id": inv.id,
            "invoice_number": inv.invoice_number,
            "booking_ref": inv.booking.booking_ref if inv.booking else "",
            "customer_name": inv.customer_name,
            "provider_name": inv.provider_name,
            "subtotal": inv.subtotal,
            "tax_amount": inv.tax_amount,
            "discount_amount": inv.discount_amount,
            "total_amount": inv.total_amount,
            "created_at": str(inv.created_at),
        })
    return results

@router.get("/{invoice_id}")
def get_invoice_detail(
    invoice_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")
    
    return {
        "id": inv.id,
        "invoice_number": inv.invoice_number,
        "booking_ref": inv.booking.booking_ref if inv.booking else "",
        "service_title": inv.booking.service.title if inv.booking and inv.booking.service else "Home Service",
        "customer_name": inv.customer_name,
        "provider_name": inv.provider_name,
        "subtotal": inv.subtotal,
        "tax_amount": inv.tax_amount,
        "discount_amount": inv.discount_amount,
        "total_amount": inv.total_amount,
        "created_at": str(inv.created_at),
    }

