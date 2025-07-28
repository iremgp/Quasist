import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import bg from "/bg.jpg";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function Home() {
  return (
    <div
      className="h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-black bg-opacity-60 p-10 rounded-xl text-center text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome to Quasist</h1>
        <p className="mb-6 text-lg">Your AI-powered assistant for question generation.</p>
        <div className="flex flex-col gap-4 items-center">
          <Link to="/login">
            <button className="bg-gray-400 hover:bg-orange-500 text-black px-6 py-2 rounded flex items-center gap-2">
              <FaSignInAlt /> Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-gray-400 hover:bg-orange-500 text-black px-6 py-2 rounded flex items-center gap-2">
              <FaUserPlus /> Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
