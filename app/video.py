from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from app.models import SignedBundle, User
from app.database import get_db
from app.hash_utils import generate_video_hashes
from app.crypto_utils import sign_data, verify_signature
from app.auth import get_current_user
from starlette.concurrency import run_in_threadpool
from app.models import UploadHistory
from yt_dlp import YoutubeDL

from datetime import datetime

import tempfile
import os
import json
import hashlib
import time
import shutil

router = APIRouter()

@router.post("/upload")
async def upload_video(
    current_user: User = Depends(get_current_user),
    video_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    ext = os.path.splitext(video_file.filename)[1].lower()
    if ext != ".mp4":
        raise HTTPException(status_code=400, detail="For this POC only .mp4 format is accepted. Convert before uploading.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
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
    if ext != ".mp4":
        raise HTTPException(status_code=400, detail="For this POC only .mp4 format is accepted. Convert before uploading.")


    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(await video_file.read())
        tmp_path = tmp.name

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



@router.post("/verify-by-url")
async def verify_by_url(
    username: str = Form(...),
    video_url: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Fetch a video from a URL (e.g., x.com), extract frames, and verify against
    the signed bundles for the specified username.
    """
    target_user = db.query(User).filter(User.username == username).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not target_user.public_key:
        raise HTTPException(status_code=400, detail="User does not have a public key on file")

    # Download to a temp file using yt-dlp
    tmp_dir = tempfile.mkdtemp()
    out_tmpl = os.path.join(tmp_dir, "clip.%(ext)s")

    ydl_opts = {
        "outtmpl": out_tmpl,
        # Prefer MP4; if not available, let yt-dlp pick best and we’ll convert-like read anyway
        "format": "mp4+bestaudio/bestvideo[ext=mp4]/best[ext=mp4]/best",
        "quiet": True,
        "nocheckcertificate": True,
    }

    downloaded_path = None
    try:
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            # Determine file path
            if "ext" in info:
                candidate = os.path.join(tmp_dir, f"clip.{info['ext']}")
                downloaded_path = candidate if os.path.exists(candidate) else None
            if not downloaded_path:
                # Fallback: find any file in tmp_dir
                for name in os.listdir(tmp_dir):
                    if name.startswith("clip."):
                        downloaded_path = os.path.join(tmp_dir, name)
                        break

        if not downloaded_path or not os.path.exists(downloaded_path):
            raise HTTPException(status_code=400, detail="Could not download video from the provided URL")

        # Run the same hashing pipeline used elsewhere
        uploaded_hashes = await run_in_threadpool(generate_video_hashes, downloaded_path, 1)

    except Exception as e:
        # Normalize errors that commonly occur with socials
        raise HTTPException(status_code=400, detail=f"Failed to process URL: {str(e)}")
    finally:
        try:
            shutil.rmtree(tmp_dir, ignore_errors=True)
        except Exception:
            pass

    # Load candidate bundles for the target user
    bundles = db.query(SignedBundle).filter(SignedBundle.user_id == target_user.id).all()
    if not bundles:
        raise HTTPException(status_code=404, detail="No signed bundles found for this user")

    public_key_bytes = target_user.public_key

    best_match = None
    highest_score = 0.0

    for bundle in bundles:
        payload_str = bundle.payload
        digest = hashlib.sha256(payload_str.encode("utf-8")).digest()

        verified_sig = await run_in_threadpool(
            verify_signature, digest, bundle.signature, public_key_bytes
        )
        if not verified_sig:
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