import os
from dotenv import load_dotenv

load_dotenv()

print("=== ENVIRONMENT CHECK ===")
print(f"SECRET_KEY    : {os.getenv('SECRET_KEY')}")
print(f"DATABASE_URL  : {os.getenv('DATABASE_URL')}")
print(f"TOKEN_EXPIRE  : {os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES')}")

print("\n=== TOKEN TEST ===")
from app.auth import create_access_token, decode_access_token

# Create a test token
token = create_access_token(data={"sub": "test@test.com", "user_id": 1})
print(f"Created token : {token}")

# Decode it immediately
decoded = decode_access_token(token)
print(f"Decoded result: {decoded}")

if decoded:
    print("\n✅ Token encode/decode is working correctly")
else:
    print("\n❌ Token decode returned None — SECRET_KEY issue")