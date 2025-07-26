from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import SignedBundle, User
from app.database import get_db
from app.hash_utils import generate_video_hashes
from app.crypto_utils import sign_data, verify_signature
from app.auth import get_current_user
from starlette.concurrency import run_in_threadpool

import tempfile
import os
import json
import hashlib
import time

router = APIRouter()

@router.post("/upload")
async def upload_video(
    current_user: User = Depends(get_current_user),
    video_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not video_file.filename.lower().endswith(".mp4"):
        raise HTTPException(status_code=400, detail="Unsupported video format")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        content = await video_file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty video file")
        tmp.write(content)
        tmp_path = tmp.name

    try:
        start = time.time()
        raw_hashes = await run_in_threadpool(generate_video_hashes, tmp_path, 1)
        duration = time.time() - start
    finally:
        os.remove(tmp_path)

    encoded_hashes = [h.encode("utf-8").decode("utf-8") for h in raw_hashes]

    payload_dict = {
        "frame_interval": 1,
        "crop_region": [250, 250],
        "hashes": encoded_hashes
    }
    payload_str = json.dumps(payload_dict)
    digest = hashlib.sha256(payload_str.encode("utf-8")).digest()

    try:
        signature = await run_in_threadpool(sign_data, current_user.private_key, digest)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signing failed: {str(e)}")

    db.add(SignedBundle(
        user_id=current_user.id,
        payload=payload_str,
        signature=signature
    ))
    db.commit()

    return {
        "message": "Video uploaded, hashed, and signed successfully",
        "filename": video_file.filename,
        "total_hashes": len(encoded_hashes),
        "hashing_duration_sec": round(duration, 2)
    }

@router.post("/verify")
async def verify_video(
    current_user: User = Depends(get_current_user),
    video_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not current_user.public_key:
        raise HTTPException(status_code=400, detail="User does not have a public key on file")

    public_key_bytes = current_user.public_key

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(await video_file.read())
        tmp_path = tmp.name

    try:
        uploaded_hashes = await run_in_threadpool(generate_video_hashes, tmp_path, 1)
    finally:
        os.remove(tmp_path)

    # Get all bundles for this user
    bundles = db.query(SignedBundle).filter(
        SignedBundle.user_id == current_user.id
    ).all()

    if not bundles:
        raise HTTPException(status_code=404, detail="No signed bundles found")

    for bundle in bundles:
        payload_str = bundle.payload
        digest = hashlib.sha256(payload_str.encode("utf-8")).digest()

        verified = await run_in_threadpool(
            verify_signature, digest, bundle.signature, public_key_bytes
        )

        if not verified:
            continue  # Try next bundle

        payload = json.loads(payload_str)
        signed_hashes = payload["hashes"]
        match_count = sum(1 for h in uploaded_hashes if h in signed_hashes)
        match_percent = match_count / max(len(uploaded_hashes), 1)

        if match_percent >= 0.8:
            return {
                "username": current_user.username,
                "match_count": match_count,
                "total_uploaded_hashes": len(uploaded_hashes),
                "match_percentage": round(match_percent * 100, 2),
                "verified": True
            }

    return {
        "username": current_user.username,
        "match_count": 0,
        "total_uploaded_hashes": len(uploaded_hashes),
        "match_percentage": 0.0,
        "verified": False
    }

