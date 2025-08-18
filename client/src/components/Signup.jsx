import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/data-access";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loader state
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = "Username is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email is invalid";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
    } else {
      setLoading(true);
      try {
        const response = await axiosInstance.post("/auth/signup", form);
        if (response.status === 201) {
          navigate("/login");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-white font-sans px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white text-black p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        {/* Username */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1">Username</label>
          <input
            name="username"
            type="text"
            className="w-full p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
            value={form.username}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            name="email"
            type="email"
            className="w-full p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="w-full p-3 pr-10 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.password}
              onChange={handleChange}
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
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : null}
          {loading ? "Signing Up..." : "Sign Up"}
        </motion.button>
      </motion.form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have a account?{" "}
          <Link to="/login" className="text-black font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
