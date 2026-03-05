from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/prayers",
    tags=["Prayers"]
)


# ── Helper function ──
# Converts a Prayer model to a PrayerResponse schema
# We need this because PrayerResponse has author_name and
# author_location which come from the related User model
def format_prayer(prayer: models.Prayer) -> dict:
    return {
        "id":              prayer.id,
        "title":           prayer.title,
        "body":            prayer.body,
        "category":        prayer.category,
        "status":          prayer.status,
        "user_id":         prayer.user_id,
        # Access the related User object via the relationship
        "author_name":     prayer.author.name     if prayer.author else None,
        "author_location": prayer.author.location if prayer.author else None,
        # prayer_count is the property we defined in models.py
        "prayer_count":    prayer.prayer_count,
        "created_at":      prayer.created_at,
    }


# ══════════════════════════════════════════
# GET ALL PRAYERS — Community Feed
# GET /api/prayers
# Public — anyone can view the feed
# Supports filtering by location and category
# ══════════════════════════════════════════
@router.get("/", response_model=List[schemas.PrayerResponse])
def get_prayers(
    # Optional query parameters for filtering
    # e.g. GET /api/prayers?location=West Africa&category=Healing
    location: Optional[str] = Query(None, description="Filter by location"),
    category: Optional[str] = Query(None, description="Filter by category"),
    skip:     int           = Query(0,    description="Number of records to skip"),
    limit:    int           = Query(20,   description="Max records to return"),
    db:       Session       = Depends(get_db)
):
    """
    Returns all prayer requests, newest first.
    Optionally filter by location and/or category.
    Supports pagination via skip and limit.
    """

    # Start building the query
    query = db.query(models.Prayer)

    # Apply location filter if provided
    if location and location != "All Locations":
        # We filter by the author's location, not a field on Prayer itself
        query = query.join(models.User).filter(
            models.User.location == location
        )

    # Apply category filter if provided
    if category and category != "All":
        query = query.filter(models.Prayer.category == category)

    # Order by newest first, then paginate
    prayers = (
        query
        .order_by(models.Prayer.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [format_prayer(p) for p in prayers]


# ══════════════════════════════════════════
# GET MY PRAYERS
# GET /api/prayers/my-prayers
# Protected — only the logged-in user's prayers
# ══════════════════════════════════════════
@router.get("/my-prayers", response_model=List[schemas.MyPrayerResponse])
def get_my_prayers(
    current_user: models.User = Depends(get_current_user),
    db:           Session     = Depends(get_db)
):
    """
    Returns all prayer requests submitted by the logged-in user.
    Ordered by newest first.
    """
    prayers = (
        db.query(models.Prayer)
        .filter(models.Prayer.user_id == current_user.id)
        .order_by(models.Prayer.created_at.desc())
        .all()
    )

    return [format_prayer(p) for p in prayers]


# ══════════════════════════════════════════
# SUBMIT A PRAYER
# POST /api/prayers
# Protected — must be logged in
# ══════════════════════════════════════════
@router.post("/", response_model=schemas.PrayerResponse,
             status_code=status.HTTP_201_CREATED)
def create_prayer(
    prayer_data:  schemas.PrayerCreate,
    current_user: models.User = Depends(get_current_user),
    db:           Session     = Depends(get_db)
):
    """
    Creates a new prayer request for the logged-in user.
    The prayer is automatically set to "active" status.
    """

    new_prayer = models.Prayer(
        title    = prayer_data.title,
        body     = prayer_data.body,
        category = prayer_data.category,
        user_id  = current_user.id,
        status   = models.PrayerStatus.active,
    )

    db.add(new_prayer)
    db.commit()
    db.refresh(new_prayer)

    return format_prayer(new_prayer)


# ══════════════════════════════════════════
# INTERCEDE FOR A PRAYER
# POST /api/prayers/{id}/intercede
# Protected — must be logged in
# A user cannot intercede for their own prayer
# A user cannot intercede for the same prayer twice
# ══════════════════════════════════════════
@router.post("/{prayer_id}/intercede",
             response_model=schemas.IntercessionResponse)
def intercede(
    prayer_id:    int,
    current_user: models.User = Depends(get_current_user),
    db:           Session     = Depends(get_db)
):
    """
    Records that the logged-in user is praying for a request.
    Increments the prayer's intercession count.
    Prevents duplicate intercessions from the same user.
    """

    # ── Check the prayer exists ──
    prayer = db.query(models.Prayer).filter(
        models.Prayer.id == prayer_id
    ).first()

    if not prayer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prayer request not found."
        )

    # ── Prevent self-intercession ──
    if prayer.user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot intercede for your own prayer request."
        )

    # ── Prevent duplicate intercessions ──
    already_prayed = db.query(models.Intercession).filter(
        models.Intercession.user_id   == current_user.id,
        models.Intercession.prayer_id == prayer_id
    ).first()

    if already_prayed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already interceded for this prayer."
        )

    # ── Record the intercession ──
    intercession = models.Intercession(
        user_id   = current_user.id,
        prayer_id = prayer_id
    )

    db.add(intercession)
    db.commit()

    # Refresh the prayer to get the updated intercession count
    db.refresh(prayer)

    return {
        "message":      "Your intercession has been recorded. 🙏",
        "prayer_count": prayer.prayer_count
    }


# ══════════════════════════════════════════
# UPDATE PRAYER STATUS
# PUT /api/prayers/{id}/status
# Protected — only the prayer's owner can update it
# Used to mark a prayer as "answered"
# ══════════════════════════════════════════
@router.put("/{prayer_id}/status", response_model=schemas.PrayerResponse)
def update_prayer_status(
    prayer_id:    int,
    status_data:  schemas.PrayerStatusUpdate,
    current_user: models.User = Depends(get_current_user),
    db:           Session     = Depends(get_db)
):
    """
    Updates a prayer's status to either "active" or "answered".
    Only the user who submitted the prayer can update its status.
    """

    # ── Find the prayer ──
    prayer = db.query(models.Prayer).filter(
        models.Prayer.id == prayer_id
    ).first()

    if not prayer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prayer request not found."
        )

    # ── Check ownership ──
    if prayer.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own prayer requests."
        )

    # ── Update and save ──
    prayer.status = status_data.status
    db.commit()
    db.refresh(prayer)

    return format_prayer(prayer)