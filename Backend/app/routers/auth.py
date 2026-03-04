from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


# ══════════════════════════════════════════
# REGISTER
# POST /api/auth/register
# Creates a new user account
# ══════════════════════════════════════════
@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    """
    Registers a new user.
    - Checks if email is already taken
    - Hashes the password
    - Saves user to database
    - Returns a JWT token so the user is logged in immediately
    """

    # ── Check if email already exists ──
    existing_user = db.query(models.User).filter(
        models.User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # ── Hash the password before saving ──
    hashed = hash_password(user_data.password)

    # ── Create and save the new user ──
    new_user = models.User(
        name     = user_data.name,
        email    = user_data.email,
        password = hashed,
        location = user_data.location,
    )
    db.add(new_user)
    db.commit()
    # refresh loads the auto-generated fields like id and created_at
    db.refresh(new_user)

    # ── Generate JWT token ──
    # "sub" (subject) is standard JWT terminology — we store the email
    token = create_access_token(data={
        "sub":     new_user.email,
        "user_id": new_user.id
    })

    return {
        "access_token": token,
        "token_type":   "bearer",
        "user":         new_user
    }


# ══════════════════════════════════════════
# LOGIN
# POST /api/auth/login
# Logs in an existing user
# ══════════════════════════════════════════
@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Logs in a user with email and password.
    - Finds the user by email
    - Verifies the password against the stored hash
    - Returns a JWT token on success
    """

    # ── Find user by email ──
    user = db.query(models.User).filter(
        models.User.email == credentials.email
    ).first()

    # ── Verify password ──
    # We give a vague error message deliberately —
    # we don't want to reveal whether the email exists
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    # ── Generate JWT token ──
    token = create_access_token(data={
        "sub":     user.email,
        "user_id": user.id
    })

    return {
        "access_token": token,
        "token_type":   "bearer",
        "user":         user
    }


# ══════════════════════════════════════════
# GET CURRENT USER
# GET /api/auth/me
# Returns the logged-in user's profile + stats
# ══════════════════════════════════════════
@router.get("/me", response_model=schemas.UserWithStats)
def get_me(
    current_user: models.User = Depends(get_current_user),
    db: Session               = Depends(get_db)
):
    """
    Returns the logged-in user's profile and stats.
    Requires a valid JWT token in the Authorization header.
    The get_current_user dependency handles token validation.
    """

    # ── Calculate user stats from the database ──
    prayers_submitted = db.query(models.Prayer).filter(
        models.Prayer.user_id == current_user.id
    ).count()

    prayers_interceded = db.query(models.Intercession).filter(
        models.Intercession.user_id == current_user.id
    ).count()

    testimonies_shared = db.query(models.Testimony).filter(
        models.Testimony.user_id == current_user.id
    ).count()

    return {
        "id":       current_user.id,
        "name":     current_user.name,
        "email":    current_user.email,
        "location": current_user.location,
        "stats": {
            "prayers_submitted":  prayers_submitted,
            "prayers_interceded": prayers_interceded,
            "testimonies_shared": testimonies_shared,
        }
    }