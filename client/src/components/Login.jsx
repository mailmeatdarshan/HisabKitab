import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/data-access";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Email is invalid";
    if (!password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
    } else {
      setLoading(true);
      try {
        const response = await axiosInstance.post("/auth/signin", { email, password });
        if (response.status === 200) {
          localStorage.setItem("token", response.data.data);
          navigate("/app");
        }
        setErrors({});
      } catch (err) {
        if (err.response) {
          alert(err.response.data.error.explanation);
        } else {
          alert("Login failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-white font-sans px-4 shadow-2xl">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white text-black p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <img src="/expenses.png" alt="HisabKitab Logo" className="h-16 w-16 md:h-20 md:w-20" />
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 pr-10 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 cursor-pointer text-sm text-gray-600"
              style={{ pointerEvents: loading ? "none" : "auto" }}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition duration-300 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : null}
          {loading ? "Logging in..." : "Login"}
        </motion.button>
      </motion.form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-black font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
