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
      className="border border-black bg-white text-black px-4 py-1.5 rounded hover:bg-black hover:text-white transition duration-300 ease-in-out"
      disabled={loading}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  )
}

export default Logout
