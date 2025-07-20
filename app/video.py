# app/video.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, VideoHash
from app.hash_utils import generate_video_hashes

import shutil
import os
import uuid

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_video(
    username: str = Form(...),
    video_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Find the user
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Save the uploaded video
    video_id = str(uuid.uuid4())
    video_path = os.path.join(UPLOAD_DIR, f"{video_id}_{video_file.filename}")

    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(video_file.file, buffer)

    # Generate scene hashes
    try:
        scene_hashes = generate_video_hashes(video_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hashing failed: {e}")

    # Store hashes in DB
    for h in scene_hashes:
        db.add(VideoHash(user_id=user.id, scene_hash=h))

    db.commit()

    return {"message": "Video uploaded and hashed", "scene_hashes_count": len(scene_hashes)}
