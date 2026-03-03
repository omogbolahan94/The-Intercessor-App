from sqlalchemy import (
    Column, Integer, String, Text,
    Boolean, DateTime, ForeignKey, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base

# ── Prayer status enum ──
# Enums restrict a column to only specific values
# A prayer can only be "active" or "answered"
class PrayerStatus(str, enum.Enum):
    active   = "active"
    answered = "answered"

# ══════════════════════════════════════════
# USER TABLE
# Stores registered user accounts
# ══════════════════════════════════════════
class User(Base):
    __tablename__ = "users"

    id           = Column(Integer, primary_key=True, index=True)
    name         = Column(String(100), nullable=False)
    email        = Column(String(255), unique=True, index=True, nullable=False)
    # We never store plain passwords — only hashed versions
    password     = Column(String(255), nullable=False)
    location     = Column(String(100), nullable=True)
    # created_at is set automatically to the current time when a user registers
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    # ── Relationships ──
    # These let us do things like user.prayers to get all their prayers
    prayers      = relationship("Prayer",      back_populates="author")
    testimonies  = relationship("Testimony",   back_populates="author")
    intercessions = relationship("Intercession", back_populates="user")


# ══════════════════════════════════════════
# PRAYER TABLE
# Stores prayer requests submitted by users
# ══════════════════════════════════════════
class Prayer(Base):
    __tablename__ = "prayers"

    id           = Column(Integer, primary_key=True, index=True)
    title        = Column(String(255), nullable=False)
    body         = Column(Text, nullable=False)
    category     = Column(String(100), nullable=True)

    # Uses the PrayerStatus enum — only "active" or "answered" allowed
    status       = Column(
                     Enum(PrayerStatus),
                     default=PrayerStatus.active,
                     nullable=False
                   )

    # Foreign key — links this prayer to the user who submitted it
    # ondelete="CASCADE" means if the user is deleted, their prayers are too
    user_id      = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"),
                          nullable=False)

    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    # ── Relationships ──
    author       = relationship("User", back_populates="prayers")
    intercessions = relationship("Intercession", back_populates="prayer",
                                 cascade="all, delete-orphan")

    # ── Property: count how many people have prayed for this ──
    # We can access this as prayer.prayer_count in our code
    @property
    def prayer_count(self):
        return len(self.intercessions)


# ══════════════════════════════════════════
# INTERCESSION TABLE
# Records which user prayed for which prayer
# Prevents the same user from interceding twice
# ══════════════════════════════════════════
class Intercession(Base):
    __tablename__ = "intercessions"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id",   ondelete="CASCADE"),
                        nullable=False)
    prayer_id  = Column(Integer, ForeignKey("prayers.id", ondelete="CASCADE"),
                        nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # ── Relationships ──
    user   = relationship("User",   back_populates="intercessions")
    prayer = relationship("Prayer", back_populates="intercessions")


# ══════════════════════════════════════════
# TESTIMONY TABLE
# Stores answered prayer testimonies
# ══════════════════════════════════════════
class Testimony(Base):
    __tablename__ = "testimonies"

    id           = Column(Integer, primary_key=True, index=True)
    testimony    = Column(Text, nullable=False)

    # If true, the author's name is hidden when displaying this testimony
    is_anonymous = Column(Boolean, default=False, nullable=False)

    user_id      = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"),
                          nullable=False)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    # ── Relationship ──
    author = relationship("User", back_populates="testimonies")