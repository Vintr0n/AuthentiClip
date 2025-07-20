from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import User, VideoHash
from app.database import get_db
from app.hash_utils import generate_video_hashes

router = APIRouter()


@router.post("/upload")
async def upload_video(
    username: str = Form(...),
    video_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate video scene hashes
    scene_hashes = generate_video_hashes(video_file.file)

    # Store scene hashes in DB
    for hash_val in scene_hashes:
        db.add(VideoHash(user_id=user.id, hash=hash_val))
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
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate hashes from uploaded file
    uploaded_hashes = generate_video_hashes(video_file.file)
    uploaded_hash_set = set(uploaded_hashes)

    # Retrieve stored hashes for this user
    stored_hashes = db.query(VideoHash).filter(VideoHash.user_id == user.id).all()
    stored_hash_set = {vh.hash for vh in stored_hashes}

    # Compare and calculate match
    matches = uploaded_hash_set.intersection(stored_hash_set)
    match_percentage = len(matches) / max(len(uploaded_hashes), 1)

    return {
        "username": username,
        "match_count": len(matches),
        "total_uploaded_hashes": len(uploaded_hashes),
        "match_percentage": round(match_percentage * 100, 2),
        "verified": match_percentage >= 80  # 80% match threshold
    }
