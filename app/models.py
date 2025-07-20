from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    public_key = Column(Text)
    private_key = Column(Text)

class SignedVideo(Base):
    __tablename__ = 'signed_videos'
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'))
    signature = Column(Text)
    perceptual_hashes = Column(Text)  # JSON-encoded list
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="videos")

User.videos = relationship("SignedVideo", back_populates="user")
