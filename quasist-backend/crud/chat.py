# crud/chat.py

from sqlalchemy.orm import Session
from models.chat import ChatHistory

def save_chat(db: Session, user_id: int, input_text: str, questions: str):
    # input_text -> prompt, questions -> response
    chat_entry = ChatHistory(
        user_id=user_id,
        prompt=input_text,
        response=questions
    )
    db.add(chat_entry)
    db.commit()
    db.refresh(chat_entry)
    return chat_entry

def get_user_history(db: Session, user_id: int):
    return (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id)
        .order_by(ChatHistory.id.desc())
        .all()
    )
