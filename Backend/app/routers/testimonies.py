from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/testimonies",
    tags=["Testimonies"]
)


# ── Helper function ──
# Converts a Testimony model to a TestimonyResponse schema
# Handles the anonymous logic — if is_anonymous is True,
# we hide the author's name but keep the location
def format_testimony(testimony: models.Testimony) -> dict:
    return {
        "id":           testimony.id,
        "testimony":    testimony.testimony,
        "is_anonymous": testimony.is_anonymous,

        # If anonymous — hide the name, show "Anonymous" instead
        # If not anonymous — show the real author name
        "author_name": (
            "Anonymous"
            if testimony.is_anonymous
            else testimony.author.name if testimony.author else None
        ),

        # We always show location even for anonymous posts
        # This keeps the community feel without revealing identity
        "author_location": (
            testimony.author.location if testimony.author else None
        ),

        "created_at": testimony.created_at,
    }


# ══════════════════════════════════════════
# GET ALL TESTIMONIES
# GET /api/testimonies
# Public — anyone can view testimonies
# ══════════════════════════════════════════
@router.get("/", response_model=List[schemas.TestimonyResponse])
def get_testimonies(
    skip:  int     = 0,
    limit: int     = 20,
    db:    Session = Depends(get_db)
):
    """
    Returns all testimonies, newest first.
    Visible to everyone — logged in or not.
    Anonymous testimonies show "Anonymous" as the author name.
    """
    testimonies = (
        db.query(models.Testimony)
        .order_by(models.Testimony.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [format_testimony(t) for t in testimonies]


# ══════════════════════════════════════════
# SUBMIT A TESTIMONY
# POST /api/testimonies
# Protected — must be logged in
# Extra rule — user must have at least one prayer request
# ══════════════════════════════════════════
@router.post("/", response_model=schemas.TestimonyResponse,
             status_code=status.HTTP_201_CREATED)
def create_testimony(
    testimony_data: schemas.TestimonyCreate,
    current_user:   models.User = Depends(get_current_user),
    db:             Session     = Depends(get_db)
):
    """
    Submits a new testimony for the logged-in user.

    Business rules enforced here:
    1. User must be logged in (handled by get_current_user dependency)
    2. User must have submitted at least one prayer request first
    3. Testimony text cannot be empty (handled by schema validator)
    4. If is_anonymous is True — author name is hidden in responses
    """

    # ── Rule: User must have at least one prayer request ──
    # We count the user's prayers directly from the database
    # This cannot be bypassed from the frontend
    prayer_count = db.query(models.Prayer).filter(
        models.Prayer.user_id == current_user.id
    ).count()

    if prayer_count == 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must submit at least one prayer request before sharing a testimony."
        )

    # ── Create and save the testimony ──
    new_testimony = models.Testimony(
        testimony    = testimony_data.testimony,
        is_anonymous = testimony_data.is_anonymous,
        user_id      = current_user.id,
    )

    db.add(new_testimony)
    db.commit()
    db.refresh(new_testimony)

    return format_testimony(new_testimony)


# ══════════════════════════════════════════
# GET MY TESTIMONIES
# GET /api/testimonies/my-testimonies
# Protected — returns only the logged-in user's testimonies
# ══════════════════════════════════════════
@router.get("/my-testimonies", response_model=List[schemas.TestimonyResponse])
def get_my_testimonies(
    current_user: models.User = Depends(get_current_user),
    db:           Session     = Depends(get_db)
):
    """
    Returns all testimonies submitted by the logged-in user.
    Shows real name regardless of is_anonymous
    since this is the user viewing their own content.
    """
    testimonies = (
        db.query(models.Testimony)
        .filter(models.Testimony.user_id == current_user.id)
        .order_by(models.Testimony.created_at.desc())
        .all()
    )

    # For own testimonies we always show the real name
    # since the user is viewing their own content
    return [
        {
            "id":              t.id,
            "testimony":       t.testimony,
            "is_anonymous":    t.is_anonymous,
            "author_name":     current_user.name,
            "author_location": current_user.location,
            "created_at":      t.created_at,
        }
        for t in testimonies
    ]


# ══════════════════════════════════════════
# DELETE A TESTIMONY
# DELETE /api/testimonies/{id}
# Protected — only the testimony's owner can delete it
# ══════════════════════════════════════════
@router.delete("/{testimony_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_testimony(
    testimony_id: int,
    current_user: models.User = Depends(get_current_user),
    db:           Session     = Depends(get_db)
):
    """
    Deletes a testimony.
    Only the user who submitted it can delete it.
    Returns 204 No Content on success.
    """

    # ── Find the testimony ──
    testimony = db.query(models.Testimony).filter(
        models.Testimony.id == testimony_id
    ).first()

    if not testimony:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimony not found."
        )

    # ── Check ownership ──
    if testimony.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own testimonies."
        )

    db.delete(testimony)
    db.commit()

    # 204 returns no body — just the status code
    return None