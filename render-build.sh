#!/usr/bin/env bash

# Extract the FFmpeg binary from the bundled tar.xz file
#mkdir -p bin
#tar -xf ffmpeg-release-amd64-static.tar.xz --strip-components=1 -C bin

# Make ffmpeg binary executable
#chmod +x bin/ffmpeg

# Install Python dependencies
pip install -r requirements.txt
