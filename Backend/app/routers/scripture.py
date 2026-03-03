from fastapi import APIRouter

router = APIRouter(
    prefix="/scripture",
    tags=["Scripture"]
)

# Placeholder — real endpoints coming in Step 6
@router.get("/test")
def test():
    return {"message": "Scripture router is working"}