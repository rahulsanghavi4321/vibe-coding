import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings

# Import Routers
from app.routers import (
    auth,
    users,
    categories,
    services,
    providers,
    technicians,
    bookings,
    payments,
    invoices,
    reviews,
    complaints,
    notifications,
    analytics,
    admin
)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Enterprise Multi-Vendor Home Services Booking SaaS Platform REST API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Open for development & preview
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to ensure database tables are created
@app.on_event("startup")
def startup_event():
    try:
        from app.database.connection import engine, Base
        import app.database.base  # registers all 27 models
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"[Warning] Database auto-initialization on startup: {e}")

# Ensure upload directory exists and mount static files
os.makedirs("uploads", exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")

# Mount API Routers under /api/v1
api_v1 = settings.API_V1_STR
app.include_router(auth.router, prefix=api_v1)
app.include_router(users.router, prefix=api_v1)
app.include_router(categories.router, prefix=api_v1)
app.include_router(services.router, prefix=api_v1)
app.include_router(providers.router, prefix=api_v1)
app.include_router(technicians.router, prefix=api_v1)
app.include_router(bookings.router, prefix=api_v1)
app.include_router(payments.router, prefix=api_v1)
app.include_router(invoices.router, prefix=api_v1)
app.include_router(reviews.router, prefix=api_v1)
app.include_router(complaints.router, prefix=api_v1)
app.include_router(notifications.router, prefix=api_v1)
app.include_router(analytics.router, prefix=api_v1)
app.include_router(admin.router, prefix=api_v1)

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
        "api": api_v1
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "database": "connected",
        "environment": settings.APP_ENV
    }

