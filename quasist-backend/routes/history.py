from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from auth.jwt import get_current_user
from models.user import User
from crud import chat
from schemas import ChatHistorySchema   # <-- burası önemli

router = APIRouter(prefix="/history", tags=["history"])  # <-- prefix eklendi

@router.get("", response_model=List[ChatHistorySchema], name="list-history")  # <-- "" (boş string)
def get_my_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return chat.get_user_history(db=db, user_id=current_user.id)


