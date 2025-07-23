from sqlalchemy import Column, Integer, LargeBinary, ForeignKey, String
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    private_key = Column(LargeBinary, nullable=True)
    public_key = Column(LargeBinary, nullable=True)

    video_hashes = relationship("VideoHash", back_populates="user")


class VideoHash(Base):
    __tablename__ = "video_hashes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    scene_hash = Column(String, index=True)  # Keep as string for `phash`
    signature = Column(LargeBinary)

    user = relationship("User", back_populates="video_hashes")
