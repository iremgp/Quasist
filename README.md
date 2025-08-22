Quasist 🎓

AI destekli soru üretim platformu

Quasist, metin veya dokümanlardan yapay zekâ destekli soru üretimi yapan bir web uygulamasıdır.
Frontend React + TailwindCSS, backend ise FastAPI üzerine kuruludur. Kullanıcı yönetimi JWT tabanlıdır.

---

## 🚀 Özellikler
- 📄 PDF, DOCX ve TXT dosyalarından içerik alma
- ✍️ Metin kutusu üzerinden doğrudan içerik girme
- 🤖 AI destekli soru üretimi (OpenAI API)
- 🔐 Kayıt / Giriş sistemi (JWT Authentication)
- 🧑‍💻 Kullanıcıya özel geçmiş kaydı
- 🎨 Modern ve responsive arayüz (TailwindCSS)

---

## 📂 Proje Yapısı

```plaintext
Quasist/
│
├── quasist-frontend/     # React + Tailwind frontend
│   ├── src/
│   │   ├── components/   # Navbar, form bileşenleri
│   │   ├── pages/        # Login, Register, Dashboard, History
│   │   └── App.jsx       # Router
│   └── package.json
│
├── quasist-backend/      # FastAPI backend
│   ├── main.py           # FastAPI app giriş noktası
│   ├── routes/           # auth.py, history.py
│   ├── models/           # SQLAlchemy modelleri
│   ├── auth/             # JWT işlemleri
│   ├── crud/             # Veritabanı fonksiyonları
│   ├── database.py       # DB bağlantısı
│   └── requirements.txt
│
└── README.md             # Bu dosya

⚙️ Kurulum
1. Backend (FastAPI)
cd quasist-backend
python -m venv venv
venv\Scripts\activate   # Windows
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
uvicorn main:app --reload


Backend artık şu adreste çalışır:
👉 http://127.0.0.1:8000

2. Frontend (React + Vite)
cd quasist-frontend
npm install
npm run dev


Frontend artık şu adreste çalışır:
👉 http://localhost:5173

🔑 Ortam Değişkenleri (.env)

Proje kökünde .env dosyası bulunmalıdır:

# Backend için
SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256

# OpenAI
OPENAI_API_KEY=your_api_key

# Veritabanı (SQLite örneği)
DATABASE_URL=sqlite:///./quasist.db

🛠 Kullanılan Teknolojiler

Backend: FastAPI, SQLAlchemy, JWT, Passlib

Frontend: React, TailwindCSS, Axios

AI: OpenAI GPT API (soru üretimi)

Database: SQLite (geliştirme için), PostgreSQL/MySQL (production önerilir)

📖 Kullanım

Register ekranından hesap oluştur.

Login yaparak giriş yap.

Dashboard sayfasında:

Metin gir veya dosya yükle

Soru sayısı ve türünü seç

"Generate Questions" butonuna bas

Sorularını gör, geçmişini History sayfasında incele.

👩‍💻 Katkıda Bulunma

Fork yap

Yeni bir branch aç: git checkout -b feature/yenilik

Commit et: git commit -m "Yeni özellik eklendi"

Pushla: git push origin feature/yenilik

Pull Request aç

📜 Lisans

Bu proje MIT lisansı altında sunulmaktadır.