# 📚 Quasist

🔗 **GitHub'da Görüntüle**: [https://github.com/iremgp/Quasist](https://github.com/iremgp/Quasist) 

Quasist, kullanıcıların doğrudan yazdığı metinlerden ya da yüklediği belgelerden yapay zekâ destekli sorular üretmesini amaçlayan modern bir web uygulamasıdır.

> 🚧 Bu proje geliştirme aşamasındadır. Sadece frontend arayüzü tamamlanmış olup, backend bağlantısı (FastAPI + PostgreSQL) ileriki adımlarda entegre edilecektir.

---

## 🚀 Özellikler

- 🔐 Kullanıcı kaydı ve oturum açma
- ✅ Şifre eşleşme kontrolü
- 📄 Belge yükleme ve metin girme arayüzü
- ✏️ Dashboard'da içerik üretim alanı
- 📁 Dosya adı ve türü otomatik görüntülenme
- 🧭 React Router ile sayfalar arası geçiş
- ❌ 404 Not Found ekranı
- 🎨 Responsive tasarım (TailwindCSS)

---

## 🛠️ Kullanılan Teknolojiler

| Katman        | Teknoloji                |
|---------------|--------------------------|
| Frontend      | React (Vite)             |
| Router        | React Router DOM         |
| Stil          | TailwindCSS              |
| İkonlar       | React Icons              |
| Durum Saklama | localStorage             |
| Build Tool    | Vite                     |
| Backend (planlı) | FastAPI + PostgreSQL |

---

## 🧾 Kurulum ve Çalıştırma

Aşağıdaki adımlarla projeyi yerel makinenizde çalıştırabilirsiniz:

```bash
# 1. Repoyu klonlayın
git clone https://github.com/iremgp/Quasist.git
cd Quasist

# 2. Gerekli bağımlılıkları yükleyin
npm install

# 3. Uygulamayı başlatın
npm run dev
```

Ardından tarayıcıda şu adrese gidin:  
👉 `http://localhost:5173`

---

## 📁 Proje Dosya Yapısı

```
quasist/
├── public/
│   └── bg.jpg                  # Arka plan görseli
├── src/
│   ├── App.jsx                 # Ana uygulama bileşeni
│   ├── main.jsx                # Uygulama başlangıcı
│   ├── index.css               # Tailwind ve global CSS
│   ├── components/
│   │   └── Navbar.jsx
│   └── pages/
│       ├── Dashboard.jsx
│       ├── Login.jsx
│       ├── Register.jsx
│       ├── Profile.jsx
│       └── NotFound.jsx
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🔐 Planlanan API ve Backend

İlerleyen aşamalarda şu servislerin entegrasyonu planlanmaktadır:

| İşlev | API / Servis |
|-------|--------------|
| Soru üretimi | OpenAI GPT-3.5 / Mistral API |
| Kullanıcı kaydı | FastAPI REST endpoint |
| Oturum yönetimi | JWT (JSON Web Token) |
| Veritabanı | PostgreSQL |
| Belge analizi | RAG / LangChain veya OCR API |

---

## 🧠 Nasıl Çalışır?

Kullanıcı:
1. Register veya Login ekranından giriş yapar.
2. Dashboard’a yönlendirilir.
3. Belge yükleyebilir veya metin girebilir.
4. Soru üretimi butonu ileriki sürümlerde eklenecektir.
5. Gelişmiş özellikler için backend entegrasyonu sağlanacaktır.

---


## 📜 Lisans

Bu proje eğitim ve portfolyo amaçlı geliştirilmiştir. Ticari kullanım için uygun değildir.
