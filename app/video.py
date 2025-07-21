from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import User, VideoHash
from app.database import get_db
from app.hash_utils import generate_video_hashes

import os
import shutil
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
    # Check user
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Save video locally
    video_id = str(uuid.uuid4())
    video_path = os.path.join(UPLOAD_DIR, f"{video_id}_{video_file.filename}")
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(video_file.file, buffer)

    # Generate hashes
    try:
        scene_hashes = generate_video_hashes(video_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hashing failed: {e}")

    # Save hashes
    for h in scene_hashes:
        db.add(VideoHash(user_id=user.id, scene_hash=h))
    db.commit()

    return {
        "message": "Video uploaded and hashed",
        "scene_hashes_count": len(scene_hashes)
    }


@router.post("/verify")
async def verify_video(
    username: str = Form(...),
    video_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Check user
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Save temp file
    video_id = str(uuid.uuid4())
    temp_path = os.path.join(UPLOAD_DIR, f"verify_{video_id}_{video_file.filename}")
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(video_file.file, buffer)

    # Generate hashes
    try:
        uploaded_hashes = generate_video_hashes(temp_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {e}")

    # Get stored hashes
    stored_hashes = db.query(VideoHash).filter(VideoHash.user_id == user.id).all()
    stored_hash_set = {vh.scene_hash for vh in stored_hashes}
    uploaded_hash_set = set(uploaded_hashes)

    # Compare
    matches = uploaded_hash_set.intersection(stored_hash_set)
    match_percentage = len(matches) / max(len(uploaded_hashes), 1) * 100

    return {
        "username": username,
        "match_count": len(matches),
        "total_uploaded_hashes": len(uploaded_hashes),
        "match_percentage": round(match_percentage, 2),
        "verified": match_percentage >= 0.8  
    }
