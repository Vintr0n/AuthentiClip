import cv2
import imagehash
from PIL import Image
import numpy as np
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")[:72]
    password_truncated = password_bytes.decode("utf-8", errors="ignore")
    return pwd_context.hash(password_truncated)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode("utf-8")[:72]
    password_truncated = password_bytes.decode("utf-8", errors="ignore")
    return pwd_context.verify(password_truncated, hashed_password)


def generate_video_hashes(video_path: str, frame_interval: int = 2, region=(250, 250)) -> list[str]:
    """
    Extract perceptual hashes from center-cropped regions of frames in a video.
    """
    scene_hashes = []
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError("Could not open video file.")

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_interval == 0:
            try:
                h, w, _ = frame.shape
                cx, cy = w // 2, h // 2
                rw, rh = region

                cropped = frame[max(0, cy - rh // 2):min(h, cy + rh // 2),
                                max(0, cx - rw // 2):min(w, cx + rw // 2)]

                resized = cv2.resize(cropped, (rw, rh))
                img = Image.fromarray(cv2.cvtColor(resized, cv2.COLOR_BGR2RGB))
                hash_str = str(imagehash.phash(img))
                scene_hashes.append(hash_str)
            except Exception:
                continue

        frame_count += 1

    cap.release()
    return scene_hashes
