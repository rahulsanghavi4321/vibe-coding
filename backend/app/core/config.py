import os
from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    APP_NAME: str = "HomeServe Technologies"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secure_jwt_secret_key_homeserve_enterprise_2026_minimum_32_chars")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database
    # Standard: mysql+pymysql://root@localhost:3306/homeserve_db?charset=utf8
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://root@localhost:3306/homeserve_db?charset=utf8")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000"
    ]
    
    # Financial defaults
    DEFAULT_COMMISSION_PERCENTAGE: float = 15.0
    DEFAULT_TAX_PERCENTAGE: float = 18.0
    
    # Storage & Payments
    MEDIA_STORAGE_DRIVER: str = os.getenv("MEDIA_STORAGE_DRIVER", "local")
    PAYMENT_MODE: str = os.getenv("PAYMENT_MODE", "simulation")  # simulation | test | live
    
    # Cloudinary (Optional credentials)
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")
    
    # Razorpay (Optional credentials)
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_placeholder")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "placeholder_secret")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
