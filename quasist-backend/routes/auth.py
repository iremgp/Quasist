# routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from schemas import UserCreate
from database import get_db
from models.user import User
from utils.password import hash_password, verify_password
from auth.jwt import create_access_token

router = APIRouter(tags=["auth"])

# ---- Request body modelleri ----
class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ---- REGISTER ----
# routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from schemas import UserCreate
from utils.password import hash_password  # sadece bunu kullanıyoruz

router = APIRouter(tags=["auth"])

@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # email var mı?
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # yeni kullanıcı
    new_user = User(
        full_name=user.full_name,       # <-- önemli
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}


# ---- LOGIN ----
@router.post("/login")
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "full_name": user.full_name
    }