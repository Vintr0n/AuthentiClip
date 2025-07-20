# app/hash_utils.py

import cv2
import hashlib

def hash_frame(frame) -> str:
    # Convert frame to grayscale to normalize hash
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (64, 64))  # Consistent size
    hash_digest = hashlib.sha256(resized).hexdigest()
    return hash_digest

def generate_video_hashes(video_path: str) -> list:
    scene_hashes = []
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError("Could not open video file")

    frame_count = 0
    interval = 30  # every 30th frame

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % interval == 0:
            try:
                frame_hash = hash_frame(frame)
                scene_hashes.append(frame_hash)
            except Exception as e:
                # If a frame fails, continue
                print(f"Error hashing frame {frame_count}: {e}")

        frame_count += 1

    cap.release()
    return scene_hashes
