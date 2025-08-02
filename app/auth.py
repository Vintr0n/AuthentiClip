from fastapi import APIRouter, HTTPException, Depends, Request, Header, Form, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.hash_utils import verify_password, hash_password
from app.crypto_utils import generate_key_pair
from app.models import User, Session as UserSession
from datetime import datetime, timedelta
from typing import Optional
import base64
import uuid
import secrets
from fastapi_mail import FastMail, MessageSchema
from app.mail_config import conf

router = APIRouter()

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
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

async def send_verification_email(email: str, token: str):
    message = MessageSchema(
        subject="Verify your ClipCert account",
        recipients=[email],
        body=(
    "Thanks for joining the ClipCert Proof of Concept.\n\n"
    f"To get started, please verify your email address by clicking the link below:\n\n"
    f"https://clipcert.com/verify-email?token={token}\n\n"
    "If you did not sign up for this account, you can ignore this message."
),
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

@router.post("/signup")
async def signup(
    background_tasks: BackgroundTasks,
    username: str = Form(...),
    password: str = Form(...),
    password2: str = Form(...),
    db: Session = Depends(get_db)
):
    if password != password2:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    private_key, public_key = generate_key_pair()
    hashed_pw = hash_password(password)
    token = secrets.token_urlsafe(32)

    user = User(
        username=username,
        hashed_password=hashed_pw,
        private_key=private_key,
        public_key=public_key,
        email_verified=False,
        verification_token=token
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    background_tasks.add_task(send_verification_email, username, token)

    return {"message": "Signup successful. Please check your email to verify your account."}

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification link")

    user.email_verified = True
    user.verification_token = None
    db.commit()

    return {"message": "Email verified. You may now log in."}

@router.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.email_verified:
        raise HTTPException(status_code=403, detail="Please verify your email before logging in.")

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
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")

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

@router.get("/usercount")
def get_user_count(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    count = db.query(User).count()
    return {"total_users": count}

@router.get("/users")
def list_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return {"users": [{"id": u.id, "username": u.username} for u in users]}
