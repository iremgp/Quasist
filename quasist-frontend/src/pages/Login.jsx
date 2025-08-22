// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Register'daki gibi kök path kullanıyoruz
      const res = await axios.post("http://127.0.0.1:8000/login", {
        email,
        password,
      });

      // Token ve isim alanlarını esnek karşıla
      const data = res.data || {};
      const token =
        data.access_token || data.token || data.jwt || data?.data?.access_token;
      const fullName =
        data.full_name || data.name || data.user?.full_name || email.split("@")[0];

      if (!token) {
        // Backend token döndürmüyorsa guard kullanıyorsan burada hata verelim
        // (Token geliyorsa aşağısı çalışacak)
        throw new Error("Token alınamadı. Backend yanıtını kontrol edin.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("fullName", fullName);

      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/bg.jpg')",
      }}
    >
      <div className="bg-black bg-opacity-60 p-10 rounded-lg text-white max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center">Login to Quasist</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded bg-gray-200 text-black focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded bg-gray-200 text-black focus:outline-none"
            required
          />

          {error && (
            <p className="text-red-400 text-sm text-center -mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="bg-gray-400 hover:bg-orange-500 text-white font-semibold py-2 rounded"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-orange-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
