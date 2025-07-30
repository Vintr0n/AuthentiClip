from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from app.video_conversion import convert_mov_to_mp4
from sqlalchemy.orm import Session
from app.models import SignedBundle, User
from app.database import get_db
from app.hash_utils import generate_video_hashes
from app.crypto_utils import sign_data, verify_signature
from app.auth import get_current_user
from starlette.concurrency import run_in_threadpool
from app.models import UploadHistory
from datetime import datetime

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
    ext = os.path.splitext(video_file.filename)[1].lower()
    if ext not in [".mp4", ".mov"]:
        raise HTTPException(status_code=400, detail="Unsupported format. Only .mp4 or .mov allowed.")


    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        content = await video_file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty video file")
        tmp.write(content)
        tmp_path = tmp.name
        if ext == ".mov":
            mp4_tmp = tmp_path.replace(".mov", ".mp4")
            try:
                await run_in_threadpool(convert_mov_to_mp4, tmp_path, mp4_tmp)
                os.remove(tmp_path)
                tmp_path = mp4_tmp
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Video conversion failed: {str(e)}")    

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
    
    db.add(UploadHistory(user_id=current_user.id, filename=video_file.filename, timestamp=datetime.utcnow()))
    db.commit()

    return {
        "message": "Video uploaded, hashed, and signed successfully",
        "filename": video_file.filename,
        "total_hashes": len(encoded_hashes),
        "hashing_duration_sec": round(duration, 2)
    }

@router.post("/verify")
async def verify_video(
    username: str = Form(...),
    video_file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user = db.query(User).filter(User.username == username).first()

    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not target_user.public_key:
        raise HTTPException(status_code=400, detail="User does not have a public key on file")

    public_key_bytes = target_user.public_key

    ext = os.path.splitext(video_file.filename)[1].lower()
    if ext not in [".mp4", ".mov"]:
        raise HTTPException(status_code=400, detail="Unsupported format. Only .mp4 or .mov allowed.")




    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(await video_file.read())
        tmp_path = tmp.name
        if ext == ".mov":
            mp4_tmp = tmp_path.replace(".mov", ".mp4")
            try:
                await run_in_threadpool(convert_mov_to_mp4, tmp_path, mp4_tmp)
                os.remove(tmp_path)
                tmp_path = mp4_tmp
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Video conversion failed: {str(e)}")    

    try:
        uploaded_hashes = await run_in_threadpool(generate_video_hashes, tmp_path, 1)
    finally:
        os.remove(tmp_path)

    bundles = db.query(SignedBundle).filter(
        SignedBundle.user_id == target_user.id
    ).all()

    if not bundles:
        raise HTTPException(status_code=404, detail="No signed bundles found for this user")

    best_match = None
    highest_score = 0.0

    for bundle in bundles:
        payload_str = bundle.payload
        digest = hashlib.sha256(payload_str.encode("utf-8")).digest()

        verified = await run_in_threadpool(
            verify_signature, digest, bundle.signature, public_key_bytes
        )

        if not verified:
            continue

        payload = json.loads(payload_str)
        signed_hashes = payload["hashes"]
        match_count = sum(1 for h in uploaded_hashes if h in signed_hashes)
        match_percent = match_count / max(len(uploaded_hashes), 1)

        if match_percent > highest_score:
            highest_score = match_percent
            best_match = {
                "username": target_user.username,
                "match_count": match_count,
                "total_uploaded_hashes": len(uploaded_hashes),
                "match_percentage": round(match_percent * 100, 2),
                "verified": match_percent >= 0.7
            }

    if best_match:
        return best_match

    return {
        "username": target_user.username,
        "match_count": 0,
        "total_uploaded_hashes": len(uploaded_hashes),
        "match_percentage": 0.0,
        "verified": False
    }

@router.get("/upload/history")
def get_upload_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    history = db.query(UploadHistory).filter(UploadHistory.user_id == current_user.id).order_by(UploadHistory.timestamp.desc()).all()
    return [
        {
            "filename": h.filename,
            "timestamp": h.timestamp.strftime("%d-%m-%Y %H:%M"),
            "guid": h.guid
        } for h in history
    ]
