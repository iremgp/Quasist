from fastapi import FastAPI, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from question_generator import chunk_text, generate_questions
from pdfminer.high_level import extract_text as extract_pdf_text
from typing import List
import docx2txt
import os
import tempfile
from fastapi.middleware.cors import CORSMiddleware

from routes import auth, history, generate
from models import user
from database import engine, Base, get_db
from auth.jwt import get_current_user
from models.user import User
from crud.chat import save_chat

from sqlalchemy.orm import Session

app = FastAPI()

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

# CORS ayarları (frontend'e erişim için)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     # <-- "*" yerine liste
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(history.router)
app.include_router(generate.router)

@app.post("/generate")
async def generate_from_text(
    text: str = Form(...),
    count: int = Form(5),
    type: str = Form("open-ended"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    chunks = chunk_text(text)
    all_questions = []
    for chunk in chunks:
        questions = generate_questions(chunk, count=count, q_type=type)
        all_questions.extend(questions)

    save_chat(
        db=db,
        user_id=current_user.id,
        input_text=text,
        questions="\n".join(all_questions)
    )

    return {"questions": all_questions}

@app.get("/")
async def root():
    return {"message": "Quasist backend is running."}

@app.post("/generate-questions-from-file")
async def generate_questions_from_file(
    file: UploadFile = File(...),
    count: int = Form(5),
    type: str = Form("open-ended")
) -> dict:

    file_ext = file.filename.split(".")[-1].lower()

    # Geçici dosya oluştur
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_ext}") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Dosya türüne göre metni çıkar
    try:
        if file_ext == "txt":
            with open(tmp_path, "r", encoding="utf-8") as f:
                text = f.read()
        elif file_ext == "pdf":
            text = extract_pdf_text(tmp_path)
        elif file_ext == "docx":
            text = docx2txt.process(tmp_path)
        else:
            os.remove(tmp_path)
            return {"error": "Only .txt, .pdf, and .docx files are supported."}
    except Exception as e:
        os.remove(tmp_path)
        return {"error": f"Failed to process file: {str(e)}"}

    os.remove(tmp_path)

    # Chunk işlemi
    chunks = chunk_text(text, max_tokens=100)

    # Soru üretimi
    all_questions = []
    for chunk in chunks:
        questions = generate_questions(chunk, count=count, q_type=type)
        all_questions.extend(questions)

    return {"questions": all_questions}



