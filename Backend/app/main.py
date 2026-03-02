from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, prayers, testimonies, scripture


# ── Create the FastAPI app instance ──
app = FastAPI(
    title="The Intercessors API",
    description="Backend API for The Intercessor community app",
    version="1.0.0"
)

# ── CORS Middleware ──
# This allows your React frontend (running on localhost:5173)
# to make requests to this backend (running on localhost:8000)
# Without this, the browser will block all requests
app.add_middleware(
    CORSMiddleware,
    # In production replace localhost with your real frontend domain
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,    # Allows cookies and auth headers
    allow_methods=["*"],       # Allows GET, POST, PUT, DELETE etc.
    allow_headers=["*"],       # Allows all headers including Authorization
)

# ── Register routers ──
# Each router is mounted under the /api prefix
app.include_router(auth.router,        prefix="/api")
app.include_router(prayers.router,     prefix="/api")
app.include_router(testimonies.router, prefix="/api")
app.include_router(scripture.router,   prefix="/api")

# ── Root endpoint ──
# A simple health check so we can confirm the server is running
@app.get("/")
def root():
    return {"message": "The Intercessors API is running 🙏"}