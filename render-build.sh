#!/usr/bin/env bash

# Install ffmpeg (system dependency)
apt-get update && apt-get install -y ffmpeg

# Install Python dependencies
pip install -r requirements.txt
