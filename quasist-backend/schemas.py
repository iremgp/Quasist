# schemas.py
from pydantic import BaseModel, ConfigDict, EmailStr

class UserCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    full_name: str
    email: EmailStr
    password: str

class ChatHistorySchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # ORM modellerinden dönüşüm için gerekli
    id: int
    user_id: int
    prompt: str | None = None
    response: str | None = None
