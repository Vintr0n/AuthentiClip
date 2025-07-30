import os
import subprocess

FFMPEG_PATH = os.path.abspath("bin/ffmpeg")

def convert_mov_to_mp4(input_path: str, output_path: str):
    result = subprocess.run([
        FFMPEG_PATH,
        "-i", input_path,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "23",
        "-c:a", "aac",
        "-movflags", "+faststart",
        output_path
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg conversion failed:\n{result.stderr.decode()}")
