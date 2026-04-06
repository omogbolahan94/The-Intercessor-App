from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime, date
from typing import Optional, List
from app.models import PrayerStatus

# ══════════════════════════════════════════
# AUTH SCHEMAS
# ══════════════════════════════════════════
class UserRegister(BaseModel):
    name:     str
    email:    EmailStr
    password: str
    location: Optional[str] = None
    date_of_birth: Optional[date] = None

    @field_validator("password")
    @classmethod
    def password_length(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters.")
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password must not exceed 72 characters.")
        return v

class UserLogin(BaseModel):
    email:    EmailStr
    password: str

class UserResponse(BaseModel):
    id:         int
    name:       str
    email:      str
    location:   Optional[str]
    created_at: datetime
    date_of_birth: Optional[date]     = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type:   str
    user:         UserResponse

# ══════════════════════════════════════════
# USER STATS SCHEMAS
# ══════════════════════════════════════════
class UserStats(BaseModel):
    prayers_submitted:  int
    prayers_interceded: int
    testimonies_shared: int

class UserWithStats(BaseModel):
    id:       int
    name:     str
    email:    str
    location: Optional[str]
    stats:    UserStats

    class Config:
        from_attributes = True

# ══════════════════════════════════════════
# PRAYER SCHEMAS
# ══════════════════════════════════════════

# What the frontend sends when submitting a prayer
class PrayerCreate(BaseModel):
    title:    str
    body:     str
    category: Optional[str] = None

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Title cannot be empty.")
        return v

    @field_validator("body")
    @classmethod
    def body_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Prayer request cannot be empty.")
        return v

# What we send back for each prayer in the feed
class PrayerResponse(BaseModel):
    id:              int
    title:           str
    body:            str
    category:        Optional[str]
    status:          PrayerStatus
    user_id:         int
    author_name:     Optional[str]  # Pulled from the related User
    author_location: Optional[str]  # Pulled from the related User
    prayer_count:    int            # Number of intercessions
    created_at:      datetime

    class Config:
        from_attributes = True

# What we send back for the user's own prayers
# Extends PrayerResponse — same fields, same structure
class MyPrayerResponse(PrayerResponse):
    pass

# Used when updating a prayer's status to "answered"
class PrayerStatusUpdate(BaseModel):
    status: PrayerStatus

# Summary returned after interceding
class IntercessionResponse(BaseModel):
    message:      str
    prayer_count: int

# ══════════════════════════════════════════
# TESTIMONY SCHEMAS
# ══════════════════════════════════════════
class TestimonyCreate(BaseModel):
    testimony:    str
    is_anonymous: bool = False

    @field_validator("testimony")
    @classmethod
    def testimony_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Testimony cannot be empty.")
        return v

class TestimonyResponse(BaseModel):
    id:              int
    testimony:       str
    is_anonymous:    bool
    author_name:     Optional[str]
    author_location: Optional[str]
    created_at:      datetime

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


# ══════════════════════════════════════════
# ── Message Schemas ───────────────────────
# ══════════════════════════════════════════
class MessageCreate(BaseModel):
    content:      str
    message_type: str = "text"   # text | verse | reaction

    @field_validator("content")
    def content_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Message cannot be empty")
        if len(v) > 1000:
            raise ValueError("Message too long")
        return v.strip()

    @field_validator("message_type")
    def valid_type(cls, v):
        if v not in ["text", "verse", "reaction"]:
            raise ValueError("Invalid message type")
        return v

class MessageResponse(BaseModel):
    id:           int
    prayer_id:    int
    user_id:      int
    content:      str
    message_type: str
    created_at:   datetime
    author_name:  str

    class Config:
        from_attributes = True