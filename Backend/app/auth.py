from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

load_dotenv()

# ── Password hashing setup ──
# bcrypt is a strong hashing algorithm — it's slow on purpose
# to make brute force attacks harder
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── JWT settings from .env ──
SECRET_KEY                = os.getenv("SECRET_KEY")
ALGORITHM                 = "HS256"  # Hashing algorithm for JWT
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))


# ── Password helpers ──

def hash_password(plain_password: str) -> str:
    """
    Converts a plain text password into a hashed string.
    """
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Checks if a plain password matches a stored hash.
    Returns True if they match, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


# ── JWT token helpers ──

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a JWT token containing the given data.
    The token expires after ACCESS_TOKEN_EXPIRE_MINUTES minutes.

    Example data: {"sub": "user@email.com", "user_id": 1}
    The frontend stores this token and sends it with every request.
    """
    to_encode = data.copy()

    # Set expiry time
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})

    # Encode the token using our secret key
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodes a JWT token and returns its payload.
    Returns None if the token is invalid or expired.

    The payload contains the user's email and id
    which we use to identify who is making the request.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None