from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import decode_access_token
from app import models

# ── Use HTTPBearer instead of OAuth2PasswordBearer ──
# HTTPBearer is simpler and more reliable for testing
# It reads the token directly from the Authorization header
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db:          Session                      = Depends(get_db)
) -> models.User:
    """
    Reads the Bearer token from the Authorization header,
    decodes it and returns the matching user from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Extract the token from the credentials object
    token = credentials.credentials

    # Decode the token
    payload = decode_access_token(token)

    if payload is None:
        raise credentials_exception

    # Get the user's email from the token
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception

    # Look up the user in the database
    user = db.query(models.User).filter(
        models.User.email == email
    ).first()

    if user is None:
        raise credentials_exception

    return user