# question_generator.py
import os, math, json
from typing import List, Dict
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()  # .env yükle
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    # Burada sert fail veriyoruz ki mesaj net olsun
    raise RuntimeError("OPENAI_API_KEY bulunamadı (.env içinde tanımla).")

client = OpenAI(api_key=OPENAI_API_KEY)

def chunk_text(text: str, max_tokens: int = 1800) -> List[str]:
    if not text:
        return []
    max_len = max_tokens * 4
    chunks, i = [], 0
    while i < len(text):
        j = min(i + max_len, len(text))
        k = text.rfind('.', i, j)
        k = (k + 1) if k != -1 else j
        chunks.append(text[i:k].strip())
        i = k
    return [c for c in chunks if c]

def _system_prompt(qtype: str) -> str:
    """
    Allowed languages: Turkish (tr) and English (en) ONLY.
    - Detect if the content is Turkish or English.
    - If Turkish -> output Turkish.
    - If English -> output English.
    - If any other language -> return {"error": "Unsupported language"}.
    - DO NOT translate between TR/EN; stay in the source language.
    Return ONLY one JSON object:
      {"questions":[{"question":str,"type":"open-ended|multiple-choice","choices":null|[str],"answer":str}]}
    """
    base = (
        "You generate exam-quality questions. "
        "Only Turkish and English are supported. "
        "If the content is Turkish, reply in Turkish. If English, reply in English. "
        'If any other language -> return {"error": "Unsupported language"}. '
        "Output MUST be a single JSON object with the required schema. "
    )
    if qtype == "multiple-choice":
        return base + "For multiple-choice, produce exactly 4 plausible choices and set 'answer' to the correct choice text."
    return base + "For open-ended, set 'choices' to null and provide a concise correct 'answer'."


def _user_prompt_from_chunk(chunk: str, count: int, qtype: str) -> str:
    # Not: burada başka bir dil yönergesi yok; sadece kuralları hatırlatıyoruz.
    return (
        f"From the following content, generate {count} {qtype} questions.\n"
        f"Remember: Only Turkish or English are supported. Stay in the SAME language as the content. "
        f"If another language, return {{\"error\": \"Unsupported language\"}}. Output ONLY JSON.\n"
        f"Content:\n---\n{chunk}\n---\n"
    )

def _call_openai(messages) -> dict:
    """
    Daha sağlam: JSON parse edemezsek güvenli hata döndür.
    """
    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7,
            response_format={"type": "json_object"},
        )
        content = resp.choices[0].message.content or ""
        import json, re
        try:
            return json.loads(content)
        except Exception:
            # Bazen model, response_format'e rağmen başına/sonuna metin ekleyebilir.
            # En dıştaki { ... } bloğunu yakalamayı dene:
            m = re.search(r"\{.*\}", content, re.DOTALL)
            if m:
                try:
                    return json.loads(m.group(0))
                except Exception:
                    pass
            # Son çare: güvenli hata döndür (Exception fırlatma!)
            return {"error": "Model returned non-JSON content"}
    except Exception as e:
        return {"error": f"OpenAI call failed: {e}"}

def generate_questions(text: str, count: int = 5, qtype: str = "open-ended") -> List[Dict]:
    if qtype not in ("open-ended", "multiple-choice"):
        qtype = "open-ended"

    chunks = chunk_text(text)
    if not chunks:
        raise ValueError("Boş metinden soru üretilemez.")

    per_chunk = max(1, math.ceil(count / max(1, len(chunks))))
    all_qs: List[Dict] = []
    for chunk in chunks:
        messages = [
            {"role": "system", "content": _system_prompt(qtype)},
            {"role": "user", "content": _user_prompt_from_chunk(chunk, per_chunk, qtype)},
        ]
        data = _call_openai(messages)
        qs = data.get("questions", [])
        for q in qs:
            q["type"] = qtype
            if qtype == "open-ended":
                q["choices"] = None
        all_qs.extend(qs)
        if len(all_qs) >= count:
            break

    return all_qs[:count]
