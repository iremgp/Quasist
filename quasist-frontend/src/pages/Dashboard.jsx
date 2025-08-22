import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const API = "http://127.0.0.1:8000/generate";

const Dashboard = () => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName") || "User";

  const fileInputRef = useRef(null);
  const uploadIntervalRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [questions, setQuestions] = useState([]); // [{question, type, choices, answer}]
  const [error, setError] = useState("");

  const [textContent, setTextContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [questionType, setQuestionType] = useState("open-ended"); // "open-ended" | "multiple-choice"

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login", { replace: true });
  }
}, [navigate]);


  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const startFakeUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    clearInterval(uploadIntervalRef.current);

    uploadIntervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadIntervalRef.current);
          setUploading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    clearInterval(uploadIntervalRef.current);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return "📕";
      case "txt":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      case "zip":
      case "rar":
        return "🗜️";
      default:
        return "📎";
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setQuestions([]);
    setError("");
    startFakeUpload(); // Yalnızca seçimi gösterelim; isteği butonda yapacağız
  };

  const handleGenerateQuestions = async () => {
    // Koruma: hem metin hem dosya aynı anda gönderilmesin
    if (!textContent && !selectedFile) {
      alert("Lütfen metin girin veya bir dosya seçin.");
      return;
    }
    if (textContent && selectedFile) {
      alert("Lütfen yalnızca metin YA DA dosya seçin (ikisi birden olamaz).");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Oturum bulunamadı. Lütfen giriş yapın.");
      return;
    }

    setLoading(true);
    setQuestions([]);
    setError("");

    try {
      const form = new FormData();
      form.append("count", String(questionCount));       // <-- backend 'count'
      form.append("qtype", questionType);                // <-- backend 'qtype'

      if (textContent) {
        form.append("text", textContent);                // <-- backend 'text'
      } else if (selectedFile) {
        form.append("files", selectedFile);              // <-- backend 'files' (List[UploadFile])
      }

      const res = await axios.post(API, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          // ÖNEMLİ: Content-Type belirtme! FormData kendi boundary'sini ayarlar.
        },
      });

      if (res.data?.ok && Array.isArray(res.data.questions)) {
        setQuestions(res.data.questions); // [{question, type, choices|null, answer}]
      } else {
        setError("Soru üretilemedi.");
      }
    } catch (err) {
      console.error("❌ Soru üretim hatası:", err);
      const msg = err?.response?.data?.detail || err.message || "Hata";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-200 text-gray-900">   {/* TÜM SAYFA GRİ */}
    <Navbar />

    {/* Navbar yüksekliği ~64px varsaydım; farklıysa sayıyı değiştir */}
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-32px)] bg-gray-200 text-gray-800">
      <h1 className="mt-6 text-3xl font-bold mb-2">
        Welcome to your dashboard, {fullName}!
      </h1>
      <p className="mb-2 text-lg text-center mb-1">
        You can start generating AI-powered questions here once you upload your material or enter your text.
      </p>
      <p className="mb-2 text-lg text-center mb-1">
        🛈 Only one of text or file will be used to generate questions.
      </p>

      <div className="px-10 pt-8 pb-2  grid grid-cols-1 md:grid-cols-2 gap-14 w-full max-w-5xl mt-1">
        {/* Metin Girişi */}
        <div className="bg-gray-100 p-6 rounded-lg border-4 border-orange-500">
          <h2 className="text-xl font-semibold text-center mb-1">✏️ Type your content</h2>
          <textarea
            placeholder="Enter your text here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full h-48 p-4 rounded bg-gray-200 text-black focus:outline-none resize-none"
          />
        </div>

        {/* Dosya Yükleme */}
        <div className="bg-gray-100 p-6 rounded-lg border-4 border-orange-500">
          <h2 className="text-xl font-semibold text-center mb-3">📄 Upload your document</h2>
          <div className="flex items-center justify-center h-48 w-full">
            <div className="flex flex-col items-center justify-center w-full mb-2">
              <button
                onClick={handleClick}
                className="bg-gray-400 hover:bg-orange-600 text-black px-4 py-2 rounded mb-0"
              >
                Select File
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.txt"
              />

              {selectedFile && (
                <div className="bg-gray-100 border border-gray-300 rounded px-4 py-3 w-full max-w-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
                      <span
                        className="text-sm truncate max-w-[150px]"
                        title={selectedFile.name}
                      >
                        {selectedFile.name}
                      </span>
                    </div>
                    <button
                      onClick={handleRemove}
                      className="text-red-500 hover:text-red-700 text-lg"
                      title="Remove file"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 transition-all duration-300"
                      style={{ width: `${uploadProgress}%`, backgroundColor: "#f97316" }}
                    />
                  </div>

                  <p className="text-sm text-center text-gray-700">
                    {uploading ? `Uploading... ${uploadProgress}%` : "Ready ✅"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ayarlar + Buton */}
        <div className="md:col-span-2 flex flex-col items-center justify-center gap-2 mt-[-38px]">
          <div className="flex flex-wrap items-center justify-center gap-6 mt-2 mb-2">
            <div className="flex items-center gap-2">
              <label htmlFor="questionCount" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Number of Questions:
              </label>
              <input
                id="questionCount"
                type="number"
                min="1"
                max="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="p-1 rounded border border-gray-300 w-20 text-center"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="questionType" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Question Type:
              </label>
              <select
                id="questionType"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="p-1 rounded border border-gray-300"
              >
                <option value="open-ended">Open-Ended</option>
                <option value="multiple-choice">Multiple Choice</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateQuestions}
            className="bg-orange-500 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Questions"}
          </button>
        </div>
      </div>

      {/* Sonuçlar (modal) */}
      {questions.length > 0 && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setQuestions([])} />
          <div className="relative top-16 mx-auto max-w-xl bg-white border border-gray-300 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">🧠 Generated Questions</h2>
              <button onClick={() => setQuestions([])} className="text-gray-600 hover:text-red-500 text-xl font-bold">
                ×
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-4">
              {questions.map((q, i) => (
                <div key={i} className="text-gray-800">
                  <p className="font-semibold text-lg">{i + 1}. {q.question}</p>
                  {q.type === "multiple-choice" && Array.isArray(q.choices) && (
                    <ol className="list-decimal pl-6 mt-1 space-y-1">
                      {q.choices.map((opt, idx) => <li key={idx}>{opt}</li>)}
                    </ol>
                  )}
                  <div className="mt-1"><em className="text-gray-600">Answer:</em> {q.answer}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setQuestions([])}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
    </div>
  </div>
);

};

export default Dashboard;
