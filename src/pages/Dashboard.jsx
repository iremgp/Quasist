import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


const Dashboard = () => {
    const navigate = useNavigate();
    const fullName = localStorage.getItem("fullName") || "User";

useEffect(() => {
    if (!localStorage.getItem("fullName")) {
        navigate("/login");
    }
}, [navigate]);

const handleClick = () => {
    fileInputRef.current.click();
};

const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
};

return (
    <>
    <Navbar />
    <div className="flex flex-col items-center justify-center h-[80vh] bg-gradient-to-br from-gray-100 to-white text-gray-800">
        <h1 className="text-3xl font-bold mb-4">Welcome to your dashboard,{fullName}!
        </h1>
        <p className="mb-6 text-lg text-center max-w-xl">
        You can start generating AI-powered questions here once you upload your material or enter your text.
        </p>
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-5xl">
        {/* Metin Girişi Alanı */}
        <div className="bg-white p-6 rounded-lg border-4 border-orange-500">
            <h2 className="text-xl font-semibold text-center mb-3">✏️ Type your content</h2>
            <textarea
            placeholder="Enter your text here..."
            className="w-full h-48 p-4 rounded bg-gray-200 text-black focus:outline-none resize-none"
            />
        </div>

        {/* Dosya Yükleme Alanı */}
        <div className="bg-white p-6 rounded-lg border-4 border-orange-500">
            <h2 className="text-xl font-semibold text-center mb-3">
            📄 Upload your document
            </h2>
            <div className="flex items-center justify-center h-48">
            <FileUpload />
            </div>
        </div>
    </div>
    </div>
    </>
);
};

const FileUpload = () => {
const fileInputRef = React.useRef();
const [selectedFile, setSelectedFile] = React.useState(null);
const [uploadProgress, setUploadProgress] = React.useState(0);
const [uploading, setUploading] = React.useState(false);
const uploadIntervalRef = React.useRef(null);

const handleClick = () => {
    fileInputRef.current.click();
};

const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(file);
    startFakeUpload();
    }
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
    }, 100); // 5% artışla 2 saniyede tamamlanır
};

const handleRemove = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploading(false);
    fileInputRef.current.value = "";
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

return (
    <div className="flex flex-col items-center justify-center w-full">
    <button
        onClick={handleClick}
        className="bg-gray-400 hover:bg-orange-500 text-black px-6 py-2 rounded mb-4"
    >
        Select File
    </button>

    <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
    />

    {selectedFile && (
        <div className="bg-gray-100 border border-gray-300 rounded px-4 py-3 w-full max-w-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
            <span className="text-sm truncate max-w-[150px]"
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
            className="bg-orange-500 h-2 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
            ></div>
        </div>

        <p className="text-sm text-center text-gray-700">
            {uploading ? `Uploading... ${uploadProgress}%` : "Upload complete ✅"}
        </p>
        </div>
    )}
    </div>
);
};

export default Dashboard;
