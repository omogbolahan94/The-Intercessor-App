from fastapi import APIRouter

router = APIRouter(
    prefix="/testimonies",
    tags=["Testimonies"]
)

# Placeholder — real endpoints coming in Step 5
@router.get("/test")
def test():
    return {"message": "Testimonies router is working"}