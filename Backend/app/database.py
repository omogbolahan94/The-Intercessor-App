from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# ── Load environment variables from .env file ──
# This reads DATABASE_URL and other secrets from your .env file
load_dotenv()

# ── Get the database URL from environment variables ──
DATABASE_URL = os.getenv("DATABASE_URL")

# ── Create the engine ──
# The engine is the actual connection to PostgreSQL
# pool_pre_ping=True checks the connection is alive before using it
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

# ── Create a session factory ──
# Each request to the API gets its own database session
# autocommit=False means we control when changes are saved
# autoflush=False means we control when changes are sent to the DB
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ── Base class for all models ──
# Every model (table) will inherit from this Base class
Base = declarative_base()

# ── Database session dependency ──
# This function is used by FastAPI endpoints to get a DB session
# The `yield` makes it a generator — FastAPI automatically
# closes the session when the request is done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()