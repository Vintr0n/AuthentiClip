@router.post("/upload")
async def upload_video(
    current_user: User = Depends(get_current_user),
    video_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # --- Validate file type ---
    if not video_file.filename.lower().endswith((".mp4")):
        raise HTTPException(status_code=400, detail="Unsupported video format")

    # --- Save temporarily ---
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            content = await video_file.read()
            if not content:
                raise HTTPException(status_code=400, detail="Empty video file")

            tmp.write(content)
            tmp_path = tmp.name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store video: {str(e)}")

    # --- Generate perceptual hashes ---
    try:
        start = time.time()
        raw_hashes = await run_in_threadpool(generate_video_hashes, tmp_path, 1)
        duration = time.time() - start
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hash generation failed: {str(e)}")
    finally:
        os.remove(tmp_path)

    # --- Serialize hashes ---
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
