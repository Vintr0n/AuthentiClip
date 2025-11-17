from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from .database import get_db
from .models import HabitDay

router = APIRouter()

HABITS = ["Water","Walk","NoLunch","Chapter","Stand","Stretch","Bed"]

def get_today(db: Session):
    today_key = str(date.today())
    row = db.query(HabitDay).filter(HabitDay.date == today_key).first()
    if not row:
        row = HabitDay(date=today_key)
        db.add(row)
        db.commit()
        db.refresh(row)
    return row

@router.get("/habits/today")
def fetch_today(db: Session = Depends(get_db)):
    row = get_today(db)
    return {h: getattr(row, h) for h in HABITS}

@router.post("/habits/increment/{habit}")
def increment(habit: str, db: Session = Depends(get_db)):
    if habit not in HABITS:
        raise HTTPException(status_code=400, detail="Unknown habit")

    row = get_today(db)
    current = getattr(row, habit)
    setattr(row, habit, current + 1)
    db.commit()
    return {"habit": habit, "value": getattr(row, habit)}
