# app/auth.py

from fastapi import APIRouter, HTTPException, Form, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.models import User
from app.database import SessionLocal
from app.crypto_utils import generate_key_pair

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/signup")
def signup(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    private_key, public_key = generate_key_pair()
    user = User(
        username=username,
        hashed_password=hash_password(password),
        private_key=private_key,
        public_key=public_key,
    )
    db.add(user)
    db.commit()

    return {"message": "User registered successfully", "public_key": public_key}

@router.post("/login")
def login(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"message": "Login successful", "public_key": user.public_key}
