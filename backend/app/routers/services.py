from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.category import Service, ServiceSubcategory, ServiceCategory
from app.schemas.category import ServiceResponse

router = APIRouter(prefix="/services", tags=["Services Catalog"])

@router.get("", response_model=List[ServiceResponse])
def get_services(
    cat_slug: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Service).join(ServiceSubcategory).join(ServiceCategory).filter(Service.is_active == True)

    if cat_slug and cat_slug != "all":
        query = query.filter(ServiceCategory.slug == cat_slug)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Service.title.ilike(search_pattern)) | 
            (Service.description.ilike(search_pattern))
        )

    services = query.all()
    results = []
    for s in services:
        results.append({
            "id": s.id,
            "title": s.title,
            "slug": s.slug,
            "description": s.description,
            "base_price": s.base_price,
            "duration_minutes": s.duration_minutes,
            "image_url": s.image_url,
            "is_active": s.is_active,
            "category_slug": s.subcategory.category.slug if s.subcategory and s.subcategory.category else None,
        })
    return results

@router.get("/popular")
def get_popular_services(db: Session = Depends(get_db)):
    services = db.query(Service).filter(Service.is_active == True).limit(4).all()
    results = []
    for s in services:
        results.append({
            "id": s.id,
            "title": s.title,
            "slug": s.slug,
            "description": s.description,
            "base_price": s.base_price,
            "duration_minutes": s.duration_minutes,
            "rating": 4.9,
            "bookings_count": 120,
            "category_name": s.subcategory.category.name if s.subcategory and s.subcategory.category else "Home Service",
        })
    return results
