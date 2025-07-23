# Updated video.py to offload CPU-bound work and remove public_key_b64 from verify
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import User, SignedBundle
from app.database import get_db
from app.hash_utils import generate_video_hashes
from app.crypto_utils import sign_data, verify_signature
from starlette.concurrency import run_in_threadpool

import tempfile
import os
import json
import hashlib
import base64
import time

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
        start = time.time()
        raw_hashes = await run_in_threadpool(generate_video_hashes, tmp_path, 1)
        duration = time.time() - start
        print(f"Hashing took {duration:.2f} seconds")
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

    signature = await run_in_threadpool(sign_data, user.private_key, digest)

    db.add(SignedBundle(
        user_id=user.id,
        payload=payload_str,
        signature=signature
    ))
    db.commit()

    return {
        "message": "Video hashes signed and stored",
        "total_hashes": len(encoded_hashes),
        "hashing_duration_sec": round(duration, 2)
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

    if not user.public_key:
        raise HTTPException(status_code=400, detail="User does not have a public key on file")

    public_key_bytes = user.public_key

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(await video_file.read())
        tmp_path = tmp.name

    try:
        uploaded_hashes = await run_in_threadpool(generate_video_hashes, tmp_path, 1)
    finally:
        os.remove(tmp_path)

    bundle = db.query(SignedBundle).filter(SignedBundle.user_id == user.id).order_by(SignedBundle.id.desc()).first()
    if not bundle:
        raise HTTPException(status_code=404, detail="No signed bundle found")

    payload_str = bundle.payload
    digest = hashlib.sha256(payload_str.encode("utf-8")).digest()

    verified = await run_in_threadpool(verify_signature, digest, bundle.signature, public_key_bytes)
    if not verified:
        raise HTTPException(status_code=400, detail="Signature verification failed")

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
