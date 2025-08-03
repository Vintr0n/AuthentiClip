from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from app.auth import get_current_user
from app.database import get_db
from app.models import Feedback, User

router = APIRouter()

class FeedbackEntry(BaseModel):
    feedback: str
    rating: int | None = None  # <-- ADD THIS

@router.post("/feedback")
def submit_feedback(
    entry: FeedbackEntry,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    feedback = Feedback(user_id=user.id, content=entry.feedback, rating=entry.rating)  # <-- UPDATE
    db.add(feedback)
    db.commit()
    return {"message": "Feedback saved"}

@router.get("/feedback/export")
def export_feedback(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    if user.username != "test@test.com":
        raise HTTPException(status_code=403, detail="Not authorized")

    entries = db.query(Feedback).join(User).all()

    return [
        {
            "username": entry.user.username,
            "feedback": entry.content,
            "rating": entry.rating,
            "timestamp": entry.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        }
        for entry in entries
    ]
