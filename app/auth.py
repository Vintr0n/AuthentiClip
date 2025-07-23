from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.crypto_utils import generate_key_pair
from pydantic import BaseModel
import base64

router = APIRouter()

class SignupResponse(BaseModel):
    id: int
    username: str
    public_key: str

@router.post("/signup", response_model=SignupResponse)
def signup(
    username: str = Form(...),
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    private_key, public_key = generate_key_pair()
    user = User(username=username, private_key=private_key, public_key=public_key)
    db.add(user)
    db.commit()
    db.refresh(user)

    return SignupResponse(
        id=user.id,
        username=user.username,
        public_key=base64.b64encode(user.public_key).decode("utf-8")
    )

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
