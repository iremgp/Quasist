import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const fullName = localStorage.getItem("fullName") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-orange-400">
        Quasist
      </Link>

      {/* Menu */}
      <div className="flex items-center gap-6">
        {token ? (
          <>
            <span className="text-gray-300">Hi, {fullName}</span>
            <Link
              to="/dashboard"
              className="hover:text-orange-400 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              className="hover:text-orange-400 transition"
            >
              History
            </Link>
            <button
              onClick={handleLogout}
              className="bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-orange-400 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:text-orange-400 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
