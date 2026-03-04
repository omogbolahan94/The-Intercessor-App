# from datetime import datetime, timedelta
# from typing import Optional
# from jose import JWTError, jwt
# from passlib.context import CryptContext
# from dotenv import load_dotenv
# import os

# load_dotenv()

# # ── Password hashing setup ──
# # bcrypt is a strong hashing algorithm — it's slow on purpose
# # to make brute force attacks harder
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # ── JWT settings from .env ──
# SECRET_KEY                = os.getenv("SECRET_KEY")
# ALGORITHM                 = "HS256"  # Hashing algorithm for JWT
# ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))


# # ── Password helpers ──

# def hash_password(plain_password: str) -> str:
#     """
#     Hashes a plain text password using bcrypt.
#     bcrypt has a hard limit of 72 bytes — we enforce
#     this in the schema but add a safety truncation here too.
#     """
#     # Safety net — truncate to 72 bytes just in case
#     truncated = plain_password.encode("utf-8")[:72]
#     return pwd_context.hash(truncated)


# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     """
#     Checks if a plain password matches a stored hash.
#     Returns True if they match, False otherwise.
#     """
#     return pwd_context.verify(plain_password, hashed_password)


# # ── JWT token helpers ──

# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
#     """
#     Creates a JWT token containing the given data.
#     The token expires after ACCESS_TOKEN_EXPIRE_MINUTES minutes.

#     Example data: {"sub": "user@email.com", "user_id": 1}
#     The frontend stores this token and sends it with every request.
#     """
#     to_encode = data.copy()

#     # Set expiry time
#     expire = datetime.utcnow() + (
#         expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     )
#     to_encode.update({"exp": expire})

#     # Encode the token using our secret key
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# def decode_access_token(token: str) -> Optional[dict]:
#     """
#     Decodes a JWT token and returns its payload.
#     Returns None if the token is invalid or expired.

#     The payload contains the user's email and id
#     which we use to identify who is making the request.
#     """
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         return payload
#     except JWTError:
#         return None

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from dotenv import load_dotenv
import bcrypt
import os

load_dotenv()

# ── JWT settings from .env ──
SECRET_KEY                  = os.getenv("SECRET_KEY")
ALGORITHM                   = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))


# ── Password helpers ──

def hash_password(plain_password: str) -> str:
    """
    Hashes a plain text password using bcrypt directly.
    - Encodes the password to bytes
    - Truncates to 72 bytes (bcrypt hard limit)
    - Returns the hash as a string for storage in the database
    """
    # Encode to bytes and truncate to bcrypt's 72 byte limit
    password_bytes = plain_password.encode("utf-8")[:72]

    # Generate a salt and hash the password
    # rounds=12 means 2^12 hashing iterations — secure but not too slow
    salt       = bcrypt.gensalt(rounds=12)
    hashed     = bcrypt.hashpw(password_bytes, salt)

    # Return as string so SQLAlchemy can store it in the database
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against a stored bcrypt hash.
    Returns True if they match, False otherwise.
    """
    password_bytes = plain_password.encode("utf-8")[:72]
    hashed_bytes   = hashed_password.encode("utf-8")

    return bcrypt.checkpw(password_bytes, hashed_bytes)


# ── JWT token helpers ──

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a signed JWT token containing the given data.
    The token expires after ACCESS_TOKEN_EXPIRE_MINUTES minutes.
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodes and validates a JWT token.
    Returns the payload dict if valid, None if invalid or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None