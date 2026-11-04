import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

try:
    connect_args = {}
    if "mysql" in settings.DATABASE_URL:
        connect_args["charset"] = "utf8"
    
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args=connect_args,
        pool_pre_ping=True,
        pool_recycle=3600,
        echo=False
    )
    # Test connection
    with engine.connect() as conn:
        logger.info(f"Connected to MySQL primary database: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'local'}")
except Exception as e:
    logger.warning(f"Primary database connection failed ({e}). Falling back to SQLite for local session...")
    FALLBACK_URL = "sqlite:///./homeserve.db"
    engine = create_engine(
        FALLBACK_URL,
        connect_args={"check_same_thread": False},
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
