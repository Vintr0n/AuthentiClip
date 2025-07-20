from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.crypto_utils import sign_hashes, verify_signature
from app.hash_utils import extract_hashes
from app.models import User, SignedVideo
import json

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/sign")
async def sign_video(username: str = Form(...), video: UploadFile = File(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return {"error": "User not found"}

    # Save uploaded file to disk
    temp_path = f"/tmp/{video.filename}"
    with open(temp_path, "wb") as f:
        f.write(await video.read())

    # Extract hashes
    hashes = extract_hashes(temp_path)

    # Sign hashes
    signature = sign_hashes(hashes, user.private_key)

    # Save signed video metadata
    record = SignedVideo(
        filename=video.filename,
        user_id=user.id,
        signature=signature,
        perceptual_hashes=json.dumps(hashes),
    )
    db.add(record)
    db.commit()

    return {"message": "Video signed successfully", "video_id": record.id}

@router.post("/verify")
async def verify_video(username: str = Form(...), video: UploadFile = File(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return {"error": "User not found"}

    original_videos = db.query(SignedVideo).filter(SignedVideo.user_id == user.id).all()

    temp_path = f"/tmp/{video.filename}"
    with open(temp_path, "wb") as f:
        f.write(await video.read())

    input_hashes = extract_hashes(temp_path)

    for vid in original_videos:
        stored_hashes = json.loads(vid.perceptual_hashes)
        is_valid, match_ratio = verify_signature(input_hashes, stored_hashes, vid.signature, user.public_key)
        if is_valid:
            return {
                "verified": True,
                "match_percent": match_ratio,
                "video_id": vid.id,
                "filename": vid.filename,
            }

    return {"verified": False, "match_percent": 0.0}
