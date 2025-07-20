# app/hash_utils.py

import cv2
import imagehash
from PIL import Image

def extract_hashes(video_path, frame_interval=30, region=(250, 250)):
    cap = cv2.VideoCapture(video_path)
    hashes = []

    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_interval == 0:
            h, w, _ = frame.shape
            cx, cy = w // 2, h // 2
            rw, rh = region
            cropped = frame[cy - rh//2:cy + rh//2, cx - rw//2:cx + rw//2]
            pil_image = Image.fromarray(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))
            phash = imagehash.phash(pil_image)
            hashes.append(str(phash))

        frame_count += 1

    cap.release()
    return hashes
