from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User, Customer
from app.models.operational import Address
from app.schemas.user import ProfileUpdateRequest, ChangePasswordRequest, AddressCreateRequest, AddressResponse
from app.core.security import verify_password, get_password_hash
from app.core.permissions import get_current_user

router = APIRouter(prefix="/users", tags=["Users & Addresses"])

@router.put("/profile")
def update_profile(request: ProfileUpdateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if request.full_name:
        current_user.full_name = request.full_name
    if request.phone:
        current_user.phone = request.phone
    db.commit()
    db.refresh(current_user)
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "phone": current_user.phone,
        "role": current_user.role,
        "status": current_user.status,
    }

@router.post("/change-password")
def change_password(request: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(request.current_password, current_user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect.")
    
    current_user.password_hash = get_password_hash(request.new_password)
    db.commit()
    return {"message": "Password updated successfully."}

@router.get("/addresses", response_model=List[AddressResponse])
def get_user_addresses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.customer_profile:
        return []
    return db.query(Address).filter(Address.customer_id == current_user.customer_profile.id).all()

@router.post("/addresses", response_model=AddressResponse)
def add_user_address(request: AddressCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.customer_profile:
        # Create profile if missing
        cust = Customer(user_id=current_user.id)
        db.add(cust)
        db.flush()
    else:
        cust = current_user.customer_profile

    if request.is_default:
        db.query(Address).filter(Address.customer_id == cust.id).update({"is_default": False})

    new_addr = Address(
        customer_id=cust.id,
        title=request.title,
        address_line1=request.address_line1,
        address_line2=request.address_line2,
        city=request.city,
        state=request.state,
        postal_code=request.postal_code,
        is_default=request.is_default
    )
    db.add(new_addr)
    db.commit()
    db.refresh(new_addr)
    return new_addr

@router.delete("/addresses/{address_id}")
def delete_user_address(address_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.customer_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found.")
    
    addr = db.query(Address).filter(Address.id == address_id, Address.customer_id == current_user.customer_profile.id).first()
    if not addr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found.")
    
    db.delete(addr)
    db.commit()
    return {"message": "Address deleted successfully."}

