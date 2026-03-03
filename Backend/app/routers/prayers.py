from fastapi import APIRouter

router = APIRouter(
    prefix="/prayers",
    tags=["Prayers"]
)

# Placeholder — real endpoints coming in Step 4
@router.get("/test")
def test():
    return {"message": "Prayers router is working"}