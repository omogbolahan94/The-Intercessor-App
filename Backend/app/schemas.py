from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional
from app.models import PrayerStatus

# ══════════════════════════════════════════
# AUTH SCHEMAS
# ══════════════════════════════════════════

# Data required to register a new user
class UserRegister(BaseModel):
    name:     str
    email:    EmailStr
    password: str
    location: Optional[str] = None

    # Validates password length before it ever reaches bcrypt
    @field_validator("password")
    @classmethod
    def password_length(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters.")
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password must not exceed 72 characters.")
        return v

# Data required to log in
class UserLogin(BaseModel):
    email:    EmailStr
    password: str

# What we send back after login or registration
class UserResponse(BaseModel):
    id:        int
    name:      str
    email:     str
    location:  Optional[str]
    created_at: datetime

    # orm_mode lets Pydantic read data from SQLAlchemy model objects
    # Without this, it wouldn't know how to convert a User model to JSON
    class Config:
        from_attributes = True

# The JWT token returned after login
class Token(BaseModel):
    access_token: str
    token_type:   str  # Always "bearer"
    user:         UserResponse

# ══════════════════════════════════════════
# USER STATS SCHEMA
# ══════════════════════════════════════════
class UserStats(BaseModel):
    prayers_submitted:  int
    prayers_interceded: int
    testimonies_shared: int

class UserWithStats(BaseModel):
    id:        int
    name:      str
    email:     str
    location:  Optional[str]
    stats:     UserStats

    class Config:
        from_attributes = True

# ══════════════════════════════════════════
# PRAYER SCHEMAS
# ══════════════════════════════════════════

# Data required to submit a new prayer
class PrayerCreate(BaseModel):
    title:    str
    body:     str
    category: Optional[str] = None

# What we send back when returning a prayer
class PrayerResponse(BaseModel):
    id:           int
    title:        str
    body:         str
    category:     Optional[str]
    status:       PrayerStatus
    user_id:      int
    # author_name and author_location are pulled from the related User
    author_name:     Optional[str]
    author_location: Optional[str]
    prayer_count: int
    created_at:   datetime

    class Config:
        from_attributes = True

# ══════════════════════════════════════════
# TESTIMONY SCHEMAS
# ══════════════════════════════════════════

# Data required to submit a testimony
class TestimonyCreate(BaseModel):
    testimony:    str
    is_anonymous: bool = False

# What we send back when returning a testimony
class TestimonyResponse(BaseModel):
    id:           int
    testimony:    str
    is_anonymous: bool
    # If anonymous, the frontend should display "Anonymous"
    author_name:     Optional[str]
    author_location: Optional[str]
    created_at:   datetime

    class Config:
        from_attributes = True

# ══════════════════════════════════════════
# SCRIPTURE SCHEMA
# ══════════════════════════════════════════
class ScriptureResponse(BaseModel):
    verse:     str
    text:      str
    theme:     str
    reasoning: str