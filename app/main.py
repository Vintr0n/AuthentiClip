from fastapi import FastAPI
from app.database import engine, Base
from app.auth import router as auth_router
from app.video import router as video_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(video_router, prefix="/video", tags=["video"])
