import React from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate eksikti, onu da ekledim

const Navbar = () => {
const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem("fullName");
    navigate("/");
};

return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
    <Link to="/dashboard" className="text-2xl font-bold text-orange-400">
        Quasist
    </Link>
    <ul className="flex space-x-6 items-center text-md">
        <li>
        <Link to="/dashboard" className="hover:text-orange-400 transition">
            Dashboard
        </Link>
        </li>
        <li>
        <Link to="/profile" className="hover:text-orange-400 transition">
            Profile
        </Link>
        </li>
        <li>
            <button
                onClick={handleLogout}
                className="bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded ml-4"
            >
                Logout
            </button>
        </li>
    </ul>
    </nav>
);
};

export default Navbar;
