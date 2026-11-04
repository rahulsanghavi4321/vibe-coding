from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import ServiceProvider, User
from app.core.permissions import require_role

router = APIRouter(prefix="/admin", tags=["Super Admin Back-Office"])

class VerifyProviderRequest(BaseModel):
    status: str # verified, rejected
    rejection_reason: Optional[str] = None

class ToggleUserStatusRequest(BaseModel):
    status: str # active, inactive, suspended

@router.patch("/providers/{provider_id}/verify")
def verify_provider(
    provider_id: int,
    request: VerifyProviderRequest,
    db: Session = Depends(get_db),
    admin = Depends(require_role(["super_admin"]))
):
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Provider not found.")

    provider.verification_status = request.status
    if request.rejection_reason:
        provider.rejection_reason = request.rejection_reason

    db.commit()
    return {
        "id": provider.id,
        "business_name": provider.business_name,
        "verification_status": provider.verification_status,
        "message": f"Provider {provider.verification_status} successfully."
    }

@router.patch("/users/{user_id}/status")
def toggle_user_account(
    user_id: int,
    request: ToggleUserStatusRequest,
    db: Session = Depends(get_db),
    admin = Depends(require_role(["super_admin"]))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.status = request.status
    db.commit()
    return {"id": user.id, "email": user.email, "status": user.status}
