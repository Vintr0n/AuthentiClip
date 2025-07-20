from fastapi import FastAPI
from app.auth import router as auth_router
from app.video import router as video_router
from app.database import Base, engine  # Import for DB initialization

# Ensure tables are created at startup
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include routers
app.include_router(auth_router, prefix="/auth")
app.include_router(video_router, prefix="/video")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Video Auth API"}
