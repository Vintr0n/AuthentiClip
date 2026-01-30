AuthentiClip (initially ClipCert)
Cryptographic Video Authentication & Verification System
AuthentiClip is a proof-of-concept application that provides cryptographic proof of video authenticity using perceptual hashing and digital signatures. It enables content creators to sign their videos and allows anyone to verify if a video matches the original signed content.
🎯 Core Concept
In an era of deepfakes and manipulated media, AuthentiClip offers a solution for video provenance:

Upload & Sign: Content creators upload videos, which are processed frame-by-frame using perceptual hashing
Cryptographic Proof: Videos are signed with Ed25519 digital signatures, creating an immutable proof of authenticity
Verify Anywhere: Anyone can verify if a video matches the original by comparing frame hashes against the signed bundle

✨ Features

Frame-by-Frame Hashing: Uses perceptual hashing (pHash) to create fingerprints of video content
Ed25519 Signatures: Military-grade cryptographic signatures ensure tamper-proof verification
User Authentication: Secure email verification and session management
Upload History: Track all videos you've signed
URL Verification: Verify videos directly from social media URLs (Twitter/X, etc.)
Match Percentage: Get precise similarity scores when comparing videos

🏗️ Architecture
Backend (FastAPI + Python)

FastAPI for high-performance REST API
SQLAlchemy with SQLite for data persistence
OpenCV for video processing
Cryptography library for Ed25519 key management
ImageHash for perceptual hashing
yt-dlp for downloading videos from URLs

Frontend (React + Vite)

React 18 with modern hooks
React Router for navigation
Tailwind CSS for styling
Lottie for animations

🚀 Getting Started
Prerequisites

Python 3.8+
Node.js 16+
npm or yarn

Backend Setup
bash# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --reload
The API will be available at http://localhost:8000
Frontend Setup
bash# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
The frontend will be available at http://localhost:5173
Environment Variables
Configure email settings in app/mail_config.py:
pythonMAIL_USERNAME = "your-email@example.com"
MAIL_PASSWORD = "your-password"
MAIL_FROM = "your-email@example.com"
MAIL_SERVER = "smtp.example.com"
📖 How It Works
1. Video Upload & Signing
User uploads video → Extract frames → Generate perceptual hashes → 
Create payload → Sign with private key → Store signed bundle
2. Video Verification
User uploads video to verify → Extract frames → Generate hashes → 
Compare with signed bundles → Return match percentage
Technical Details

Perceptual Hashing: Resistant to minor compression, resizing, and format changes
Frame Interval: Processes every frame (configurable)
Crop Region: 250x250 center crop for consistent hashing
Verification Threshold: 70% match considered authentic
Hash Algorithm: pHash via imagehash library
Signature Algorithm: Ed25519

🛣️ API Endpoints
Authentication

POST /auth/signup - Create new account
POST /auth/login - Login and get session token
POST /auth/logout - Invalidate session
GET /auth/me - Get current user info
GET /auth/verify-email - Verify email address
POST /auth/forgot-password - Request password reset
POST /auth/reset-password - Reset password with token

Video Operations

POST /video/upload - Upload and sign a video
POST /video/verify - Verify video against user's signed content
POST /video/verify-by-url - Verify video from URL
GET /video/upload/history - Get upload history

Feedback

POST /feedback - Submit feedback
GET /feedback/export - Export all feedback (admin only)

🔐 Security Features

Email Verification: Required before video operations
Session Management: 7-day session tokens with automatic cleanup
Password Hashing: bcrypt with salt
Private Key Storage: Encrypted storage of user private keys
Rate Limiting: Prevents abuse (implement in production)

📝 Use Cases

Content Creators: Prove ownership of original video content
Journalists: Verify authenticity of news footage
Social Media: Combat deepfakes and manipulated videos
Legal Evidence: Establish chain of custody for video evidence
Brand Protection: Verify official promotional videos

⚠️ Limitations
This is a proof-of-concept with several important limitations:

Only supports MP4 format (by design for POC)
SQLite database (use PostgreSQL for production)
No distributed storage (videos processed in-memory)
Basic rate limiting needed for production
Email configuration required for verification

🔮 Future Enhancements

 Support for additional video formats
 Blockchain integration for public ledger
 Mobile app for on-the-go verification
 Browser extension for instant verification
 Distributed hash storage (IPFS)
 Advanced tampering detection
 Multi-signature support
 API rate limiting and quotas

🤝 Contributing
This is a proof-of-concept project. Contributions, issues, and feature requests are welcome!
📄 License
This project is provided as-is for demonstration purposes.

Note: This is a proof-of-concept. For production use, implement proper security audits, scalable infrastructure, and compliance with relevant regulations.
