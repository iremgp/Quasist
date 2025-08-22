import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(res.data.value || []);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading) return <p className="text-center text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold mb-6">My History</h2>
      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-700 text-left text-gray-300 uppercase text-sm">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Prompt</th>
                <th className="py-3 px-4">Response</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-700 hover:bg-gray-600 transition"
                >
                  <td className="py-3 px-4">{item.id}</td>
                  <td className="py-3 px-4">{item.prompt}</td>
                  <td className="py-3 px-4 whitespace-pre-line">
                    {item.response}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
