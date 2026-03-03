from fastapi import APIRouter

# APIRouter is like a mini FastAPI app
# We group related endpoints together in one router
router = APIRouter(
    prefix="/auth",
    tags=["Auth"]  # Groups endpoints together in the /docs page
)

# Placeholder — real endpoints coming in Step 3
@router.get("/test")
def test():
    return {"message": "Auth router is working"}