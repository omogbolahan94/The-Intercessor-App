from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, prayers, testimonies, scripture, messages

app = FastAPI(
    title="The Intercessors API",
    description="Backend API for the PrayerConnect community app",
    version="1.0.0",
    # Tell Swagger to use HTTP Bearer token authentication
    swagger_ui_parameters={"persistAuthorization": True}
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──
app.include_router(auth.router,        prefix="/api")
app.include_router(prayers.router,     prefix="/api")
app.include_router(testimonies.router, prefix="/api")
app.include_router(scripture.router,   prefix="/api")
app.include_router(messages.router,    prefix="/api")

@app.get("/")
def root():
    return {"message": "The Intercessors API is running 🙏"}