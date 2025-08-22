# routes/generate.py
from fastapi import APIRouter, Form, File, UploadFile, Depends, HTTPException
from typing import Optional, List
from sqlalchemy.orm import Session
from database import get_db
from auth.jwt import get_current_user
from models.user import User
from question_generator import generate_questions

import tempfile
import os

# İsteğe bağlı: bu kütüphaneler yüklü olmalı
# pip install pdfminer.six python-docx docx2txt
from pdfminer.high_level import extract_text as extract_pdf_text
import docx2txt

router = APIRouter(prefix="", tags=["generate"])

def _read_any_file(f: UploadFile) -> str:
    name = (f.filename or "").lower()
    # Geçici dosyaya kaydedip okuyacağız
    suffix = os.path.splitext(name)[1] if name else ""
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(f.file.read())
        tmp_path = tmp.name

    try:
        if name.endswith(".pdf"):
            return extract_pdf_text(tmp_path) or ""
        elif name.endswith(".docx"):
            return docx2txt.process(tmp_path) or ""
        elif name.endswith(".txt"):
            with open(tmp_path, "r", encoding="utf-8", errors="ignore") as fh:
                return fh.read()
        else:
            # Bilinmeyen uzantı ise düz metin gibi dene
            with open(tmp_path, "rb") as fh:
                raw = fh.read()
            try:
                return raw.decode("utf-8")
            except:
                return raw.decode("latin-1", errors="ignore")
    finally:
        try:
            os.unlink(tmp_path)
        except:
            pass

@router.post("/generate")
async def generate_endpoint(
    # Not: Form(...) yerine Form(None) -> metin göndermeyen client’ı da destekler
    text: Optional[str] = Form(None),
    count: int = Form(5),
    qtype: str = Form("open-ended"),
    files: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Aynı uç noktadan İKİ akış:
      - Sadece metin (text) geldi -> direkt soru üret
      - Dosya(lar) geldi -> içerikleri birleştir, sonra soru üret

    Frontend mutlaka multipart/form-data ile gelsin (FormData).
    """
    try:
        source_text = ""

        # 1) Dosya varsa öncelik dosyadan
        if files:
            combined = []
            for f in files:
                if not f:
                    continue
                try:
                    content = _read_any_file(f)
                    if content and content.strip():
                        combined.append(content.strip())
                except Exception as ex:
                    # Tek dosyada hata olsa da diğerlerini okumaya devam edelim
                    print("File read error:", f.filename, ex)
            source_text = "\n\n".join(combined).strip()

        # 2) Dosya yoksa metni kullan
        if not source_text:
            if text is None:
                # Form alanı yoksa, kullanıcı JSON göndermiş olabilir.
                # Bu endpoint Form bekliyor -> 415/422 yerine anlamlı mesaj
                raise HTTPException(
                    status_code=415,
                    detail="İstek 'multipart/form-data' olmalı ve 'text' alanı FormData ile gönderilmeli."
                )
            if not text.strip():
                raise HTTPException(status_code=400, detail="Metin boş olamaz.")
            source_text = text.strip()

        # 3) Soru üret
        questions = generate_questions(text=source_text, count=count, qtype=qtype)
        return {"ok": True, "from": "files" if files else "text", "questions": questions}

    except HTTPException:
        raise
    except ValueError as ve:
        # generate_questions içinden gelen anlamlı hatalar (ör. Unsupported language)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
