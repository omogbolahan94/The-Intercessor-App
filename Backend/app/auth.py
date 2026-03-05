from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from dotenv import load_dotenv
import bcrypt
import os

load_dotenv()

# ── Settings ──
SECRET_KEY                  = os.getenv("SECRET_KEY", "fallback_secret_key")
ALGORITHM                   = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))


def hash_password(plain_password: str) -> str:
    """Hash a plain password using bcrypt."""
    password_bytes = plain_password.encode("utf-8")[:72]
    salt           = bcrypt.gensalt(rounds=12)
    hashed         = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a stored hash."""
    password_bytes = plain_password.encode("utf-8")[:72]
    hashed_bytes   = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a JWT token.
    Uses timezone-aware UTC time to avoid deprecation warnings.
    """
    to_encode = data.copy()

    # Use timezone-aware datetime
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodes and validates a JWT token.
    Returns the payload if valid, None if invalid or expired.
    """
    try:
        # Clean the token in case there are extra spaces or newlines
        token   = token.strip()
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload
    except JWTError as e:
        return None