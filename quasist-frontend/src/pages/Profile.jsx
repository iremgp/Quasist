import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Profile = () => {
    const navigate = useNavigate();
    const fullName = localStorage.getItem("fullName") || "User";

useEffect(() => {
    if (!localStorage.getItem("fullName")) {
    navigate("/login");
    }
}, [navigate]);

return (
    <>
    <Navbar />
    <div className="flex flex-col items-center justify-center h-[80vh] bg-gradient-to-br from-gray-100 to-white text-gray-800">
    <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
        <p className="text-lg text-center max-w-xl">Profile details and settings will go here.</p>
    </div>
    </div>
    </>
);
};

export default Profile;
