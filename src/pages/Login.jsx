import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Both fields are required.");
    return;
  }
}

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
            required
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded bg-gray-200 text-black focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded bg-gray-200 text-black focus:outline-none"
          />
          <button
            type="submit"
            className="bg-gray-400 hover:bg-orange-500 text-white font-semibold py-2 rounded"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-orange-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

