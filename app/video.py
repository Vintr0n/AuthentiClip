from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import User, SignedBundle
from app.database import get_db
from app.hash_utils import generate_video_hashes
from app.crypto_utils import sign_data, verify_signature

import tempfile
import os
import json
import hashlib

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

    # Create payload
    payload_dict = {
        "frame_interval": 2,
        "crop_region": [250, 250],
        "hashes": scene_hashes
    }
    payload_str = json.dumps(payload_dict)
    digest = hashlib.sha256(payload_str.encode("utf-8")).digest()

    # Sign payload digest
    signature = sign_data(user.private_key, digest)

    # Store bundle in DB
    db.add(SignedBundle(
        user_id=user.id,
        payload=payload_str,
        signature=signature
    ))
    db.commit()

    return {
        "message": "Video hashes signed and stored",
        "total_hashes": len(scene_hashes)
    }

@router.post("/verify")
async def verify_video(
    username: str = Form(...),
    public_key_b64: str = Form(...),
    video_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    import base64

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    public_key_bytes = base64.b64decode(public_key_b64)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(await video_file.read())
        tmp_path = tmp.name

    try:
        uploaded_hashes = generate_video_hashes(tmp_path)
    finally:
        os.remove(tmp_path)

    # For now, use the latest bundle by the user
    bundle = db.query(SignedBundle).filter(SignedBundle.user_id == user.id).order_by(SignedBundle.id.desc()).first()
    if not bundle:
        raise HTTPException(status_code=404, detail="No signed bundle found")

    # Verify the signature first
    payload_str = bundle.payload
    digest = hashlib.sha256(payload_str.encode("utf-8")).digest()

    if not verify_signature(digest, bundle.signature, public_key_bytes):
        raise HTTPException(status_code=400, detail="Signature verification failed")

    # Extract original signed hashes
    payload = json.loads(payload_str)
    signed_hashes = payload["hashes"]

    match_count = sum(1 for h in uploaded_hashes if h in signed_hashes)
    match_percent = match_count / max(len(uploaded_hashes), 1)

    return {
        "username": username,
        "match_count": match_count,
        "total_uploaded_hashes": len(uploaded_hashes),
        "match_percentage": round(match_percent * 100, 2),
        "verified": match_percent >= 0.8
    }
