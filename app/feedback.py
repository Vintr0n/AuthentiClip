from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from fastapi import Depends
from sqlalchemy.orm import Session
from app.auth import get_current_user
from pydantic import BaseModel
from app.database import get_db
from datetime import datetime

router = APIRouter()

class FeedbackEntry(BaseModel):
    feedback: str

@router.post("/feedback")
async def submit_feedback(entry: FeedbackEntry, user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        with open("feedback_log.txt", "a") as f:
            f.write(f"{datetime.utcnow()} - {user.username}:\n{entry.feedback}\n\n")
        return {"message": "Feedback saved"}
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to save feedback")



@router.get("/feedback/export")
async def download_feedback(user=Depends(get_current_user)):
    if user.username != "test@test.com":
        raise HTTPException(status_code=403, detail="Not authorized")
    return FileResponse("/mnt/data/feedback_log.txt", filename="feedback_log.txt")
