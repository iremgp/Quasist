// src/api/history.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";  // Backend adresin

export const getHistory = async () => {
  try {
    const token = localStorage.getItem("token"); // Login sonrası sakladığın JWT
    const response = await axios.get(`${API_URL}/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;  // history listesini döndür
  } catch (error) {
    console.error("History fetch error:", error);
    throw error;
  }
};
