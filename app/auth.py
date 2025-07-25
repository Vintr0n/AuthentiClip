from fastapi import APIRouter, HTTPException, Depends, Request, Header, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.hash_utils import verify_password, hash_password
from app.crypto_utils import generate_key_pair
from app.models import User, Session as UserSession
from datetime import datetime, timedelta
from typing import Optional
import base64
import uuid

router = APIRouter()

# Must be defined before using it in dependencies
def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")

    token = authorization.split(" ")[1]
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


@router.post("/signup")
def signup(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    private_key, public_key = generate_key_pair()
    hashed_pw = hash_password(password)

    user = User(
        username=username,
        hashed_password=hashed_pw,
        private_key=private_key,
        public_key=public_key
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "username": user.username,
        "public_key": base64.b64encode(user.public_key).decode("utf-8")
    }


@router.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    db.query(UserSession).filter(UserSession.expires_at < datetime.utcnow()).delete()

    token = str(uuid.uuid4())
    session = UserSession(
        user_id=user.id,
        session_token=token,
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(session)
    db.commit()

    return {"access_token": token, "token_type": "bearer"}


@router.post("/logout")
def logout(
    request: Request,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        return {"message": "Invalid header"}

    token = authorization.split(" ")[1]
    session = db.query(UserSession).filter(UserSession.session_token == token).first()
    if session:
        db.delete(session)
        db.commit()

    return {"message": "Logged out"}


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username
    }


@router.get("/username/{username}")
def get_user(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "username": user.username,
        "public_key": base64.b64encode(user.public_key).decode("utf-8") if user.public_key else None
    }
