from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import User, VideoHash
from app.database import get_db
from app.hash_utils import generate_video_hashes
from app.crypto_utils import sign_data, verify_signature

import tempfile
import os

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

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(await video_file.read())
        tmp_path = tmp.name

    try:
        scene_hashes = generate_video_hashes(tmp_path)
    finally:
        os.remove(tmp_path)

    for scene_hash in scene_hashes:
        signature = sign_data(user.private_key, scene_hash.encode("utf-8"))
        db.add(VideoHash(user_id=user.id, scene_hash=scene_hash, signature=signature))

    db.commit()

    return {
        "message": "Video uploaded and digitally signed",
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

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(await video_file.read())
        tmp_path = tmp.name

    try:
        uploaded_hashes = generate_video_hashes(tmp_path)
    finally:
        os.remove(tmp_path)

    # Load stored scene hashes into a dict for fast lookup
    stored_hashes = db.query(VideoHash).filter(VideoHash.user_id == user.id).all()
    stored_hash_map = {vh.scene_hash: vh.signature for vh in stored_hashes}

    # Match uploaded scene hashes against stored ones
    verified_matches = 0
    for uploaded_hash in uploaded_hashes:
        stored_signature = stored_hash_map.get(uploaded_hash)
        if stored_signature:
            if verify_signature(uploaded_hash.encode("utf-8"), stored_signature, user.public_key):
                verified_matches += 1

    match_percentage = verified_matches / max(len(uploaded_hashes), 1)

    return {
        "username": username,
        "match_count": verified_matches,
        "total_uploaded_hashes": len(uploaded_hashes),
        "match_percentage": round(match_percentage * 100, 2),
        "verified": match_percentage >= 0.8
    }
