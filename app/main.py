from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.auth import router as auth_router
from app.video import router as video_router
import os

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(video_router, prefix="/video", tags=["video"])

# Serve frontend
@app.get("/")
def serve_index():
    return FileResponse("static/index.html")

# CORS (optional)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
