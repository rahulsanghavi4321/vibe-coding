from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.category import ServiceCategory, ServiceSubcategory
from app.schemas.category import CategoryCreateRequest, CategoryResponse
from app.core.permissions import require_role

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(ServiceCategory).filter(ServiceCategory.is_active == True).order_by(ServiceCategory.display_order.asc(), ServiceCategory.id.asc()).all()

@router.post("", response_model=CategoryResponse)
def create_category(request: CategoryCreateRequest, db: Session = Depends(get_db), user = Depends(require_role(["super_admin"]))):
    existing = db.query(ServiceCategory).filter(ServiceCategory.slug == request.slug).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category slug already exists.")

    cat = ServiceCategory(
        name=request.name,
        slug=request.slug,
        description=request.description,
        icon=request.icon,
        image_url=request.image_url,
        is_active=request.is_active
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@router.patch("/{category_id}/status")
def toggle_category_status(category_id: int, db: Session = Depends(get_db), user = Depends(require_role(["super_admin"]))):
    cat = db.query(ServiceCategory).filter(ServiceCategory.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found.")
    cat.is_active = not cat.is_active
    db.commit()
    return {"id": cat.id, "is_active": cat.is_active}
