from typing import Optional, List
from pydantic import BaseModel

class CategoryCreateRequest(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True

class SubcategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    is_active: bool
    subcategories: List[SubcategoryResponse] = []

    class Config:
        from_attributes = True

class ServiceResponse(BaseModel):
    id: int
    title: str
    slug: str
    description: Optional[str] = None
    base_price: float
    duration_minutes: int
    image_url: Optional[str] = None
    is_active: bool
    category_slug: Optional[str] = None

    class Config:
        from_attributes = True
