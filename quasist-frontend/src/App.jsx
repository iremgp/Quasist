import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import bg from "/bg.jpg";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import History from "./pages/History";

// ✅ Sadece token varsa erişim izni veren basit guard
function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function Home() {
  return (
    <div
      className="h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-black bg-opacity-60 p-10 rounded-xl text-center text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome to Quasist</h1>
        <p className="mb-6 text-lg">
          Your AI-powered assistant for question generation.
        </p>
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
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/history"
          element={
            <RequireAuth>
              <History />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
