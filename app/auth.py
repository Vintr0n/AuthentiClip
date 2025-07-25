from fastapi import APIRouter, HTTPException, Depends, Request, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.crypto_utils import verify_password, generate_key_pair, hash_password
from app.models import User, UserSession
from datetime import datetime, timedelta
from typing import Optional
import base64

router = APIRouter(prefix="/auth")

@router.post("/signup")
def signup(email: str, password: str, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    private_key, public_key = generate_key_pair()
    password_hash = hash_password(password)

    user = User(email=email, password_hash=password_hash, private_key=private_key, public_key=public_key)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User created", "public_key": base64.b64encode(user.public_key).decode()}

@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == username).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = str(uuid.uuid4())
    expires = datetime.utcnow() + timedelta(days=1)
    session = UserSession(user_id=user.id, session_token=token, expires_at=expires)
    db.add(session)
    db.commit()
    return {"access_token": token, "token_type": "bearer"}

@router.get("/username/{email}")
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "email": user.email,
        "public_key": base64.b64encode(user.public_key).decode() if user.public_key else None
    }

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")

    token = authorization[7:]
    session = db.query(UserSession).filter(
        UserSession.session_token == token,
        UserSession.expires_at > datetime.utcnow()
    ).first()

    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email}
