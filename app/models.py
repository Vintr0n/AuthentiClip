# Updated models.py to add Session table for user authentication
from sqlalchemy import Column, Integer, LargeBinary, ForeignKey, String, Text, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from uuid import uuid4
from datetime import datetime



from datetime import datetime, timedelta
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    private_key = Column(LargeBinary, nullable=True)
    public_key = Column(LargeBinary, nullable=True)

    bundles = relationship("SignedBundle", back_populates="user")
    sessions = relationship("Session", back_populates="user")
    feedback_entries = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")
    upload_history = relationship("UploadHistory", back_populates="user", cascade="all, delete-orphan")


class SignedBundle(Base):
    __tablename__ = "signed_bundles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    payload = Column(Text)
    signature = Column(LargeBinary)

    user = relationship("User", back_populates="bundles")

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_token = Column(String, unique=True, index=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(days=7))

    user = relationship("User", back_populates="sessions")


class UploadHistory(Base):
    __tablename__ = "upload_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    guid = Column(String, default=lambda: str(uuid4()))

    user = relationship("User", back_populates="upload_history")

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="feedback_entries")
