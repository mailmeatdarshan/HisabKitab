import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/data-access';

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token is missing. Please log in again.");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/signout");
      if (response.status === 200) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 px-4 py-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition duration-200 text-sm font-semibold cursor-pointer shadow-sm"
      disabled={loading}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  )
}

export default Logout
