from sqlalchemy import Column, Integer, LargeBinary, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    private_key = Column(LargeBinary, nullable=True)
    public_key = Column(LargeBinary, nullable=True)

    bundles = relationship("SignedBundle", back_populates="user")


class SignedBundle(Base):
    __tablename__ = "signed_bundles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    payload = Column(Text)  # JSON string of frame hashes and metadata
    signature = Column(LargeBinary)  # Ed25519 signature of the payload

    user = relationship("User", back_populates="bundles")
