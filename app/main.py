from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.auth import router as auth_router
from app.video import router as video_router
from app.feedback import router as feedback_router


app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(video_router, prefix="/video", tags=["video"])
app.include_router(feedback_router, prefix="", tags=["feedback"])


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
