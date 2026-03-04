from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import decode_access_token
from app import models

# ── OAuth2 scheme ──
# This tells FastAPI to look for a Bearer token
# in the Authorization header of each request
# tokenUrl is where clients go to get a token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    token: str        = Depends(oauth2_scheme),
    db:    Session    = Depends(get_db)
) -> models.User:
    """
    Decodes the JWT token from the request header and
    returns the corresponding User from the database.

    Any endpoint that needs authentication uses this
    as a dependency like this:
        current_user: models.User = Depends(get_current_user)

    FastAPI automatically calls this function before
    the endpoint runs and injects the result.
    """

    # Define the error we'll raise if authentication fails
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Decode the token
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    # Extract the user's email from the token payload
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception

    # Look up the user in the database
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception

    return user