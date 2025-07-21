import cv2
import imagehash
from PIL import Image
import numpy as np

def generate_video_hashes(video_path: str, frame_interval: int = 2, region=(256, 256)):
    """
    Extract perceptual hashes from center-cropped regions of frames in a video.

    Args:
        video_path (str): Path to video file.
        frame_interval (int): Number of frames to skip between samples.
        region (tuple): (width, height) for the center-crop region.

    Returns:
        List[str]: A list of perceptual hashes as strings.
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

        # Sample every `frame_interval` frames
        if frame_count % frame_interval == 0:
            try:
                h, w, _ = frame.shape
                cx, cy = w // 2, h // 2
                rw, rh = region

                # Crop to center region
                cropped = frame[max(0, cy - rh // 2):min(h, cy + rh // 2),
                                max(0, cx - rw // 2):min(w, cx + rw // 2)]

                # Resize for consistency
                resized = cv2.resize(cropped, (rw, rh))

                # Convert to RGB and hash
                img = Image.fromarray(cv2.cvtColor(resized, cv2.COLOR_BGR2RGB))
                hash_str = str(imagehash.phash(img))
                scene_hashes.append(hash_str)
            except Exception:
                continue  # Skip problematic frames

        frame_count += 1

    cap.release()
    return scene_hashes
