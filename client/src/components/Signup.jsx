import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import lottie from "lottie-web";
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import axiosInstance from "../utils/data-access";

function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function FacebookIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="#1877F2" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LottiePlayer({ animationPath, className = "" }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (animRef.current) {
      animRef.current.destroy();
      animRef.current = null;
    }
    try {
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: animationPath,
      });
    } catch (err) {
      console.error(err);
    }
    return () => {
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [animationPath]);

  return <div ref={containerRef} className={className} />;
}

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = "Username is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Must be at least 6 characters";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/signup", form);
      if (response.status === 201) {
        navigate("/login");
      }
      setErrors({});
    } catch (err) {
      if (err.response?.data?.error?.explanation) {
        setServerError(err.response.data.error.explanation);
      } else {
        setServerError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white text-slate-900 font-sans selection:bg-[#00C58D] selection:text-white">
      {/* ===================================================================== */}
      {/* LEFT HALF: 50% Full-Screen Orange Showcase                            */}
      {/* ===================================================================== */}
      <div className="w-full md:w-1/2 min-h-[460px] md:min-h-screen bg-[#FF6422] p-8 sm:p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Back Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to HisabKitab</span>
          </Link>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free Forever</span>
          </div>
        </div>

        {/* Center: Two Floating Phone Mockups with Lottie Animations */}
        <div className="relative z-10 my-auto py-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm flex items-center justify-center gap-4 sm:gap-6">
            {/* Phone Card 1: Gullak Goals */}
            <div className="w-44 sm:w-48 bg-white text-slate-800 rounded-3xl p-3.5 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300 flex flex-col items-center">
              <div className="w-10 h-1 bg-slate-200 rounded-full mb-2.5" />
              <div className="w-full h-36 sm:h-40 rounded-2xl bg-[#FFF8F0] flex items-center justify-center overflow-hidden mb-3">
                <LottiePlayer
                  animationPath="/gullak.json"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-xs font-bold text-slate-900 leading-tight text-center">
                Gullak Savings
              </div>
              <div className="text-[10px] text-slate-500 text-center mt-0.5">
                Micro-Goals & Vaults
              </div>
              <div className="mt-2.5 text-[10px] font-semibold text-[#FF6422] bg-[#FFF3ED] px-2.5 py-0.5 rounded-full">
                Goal Milestones
              </div>
            </div>

            {/* Phone Card 2: Spending Analytics */}
            <div className="w-44 sm:w-48 bg-white text-slate-800 rounded-3xl p-3.5 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300 flex flex-col items-center">
              <div className="w-10 h-1 bg-slate-200 rounded-full mb-2.5" />
              <div className="w-full h-36 sm:h-40 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden mb-3">
                <LottiePlayer
                  animationPath="/charts.json"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-xs font-bold text-slate-900 leading-tight text-center">
                Spending Analytics
              </div>
              <div className="text-[10px] text-slate-500 text-center mt-0.5">
                Category Burn Rates
              </div>
              <div className="mt-2.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Instant Sync
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-white/95 text-sm sm:text-base font-medium max-w-sm">
            Unlock your full financial command center with deep analytics and zero data tracking.
          </p>
        </div>

        {/* Bottom: Brand Identity */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/20">
          <div className="flex items-center gap-2.5">
            <img
              src="/expenses.png"
              alt="HisabKitab"
              className="w-7 h-7 object-contain"
            />
            <span className="font-extrabold text-lg tracking-tight text-white">
              HisabKitab
            </span>
          </div>
          <div className="text-xs text-white/80 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted Ledger</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* RIGHT HALF: 50% Full-Screen Form Container                            */}
      {/* ===================================================================== */}
      <div className="w-full md:w-1/2 min-h-screen bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
        {/* Top Spacer or Mobile Back */}
        <div className="md:hidden mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Centered Form Area */}
        <div className="max-w-md w-full mx-auto my-auto py-6">
          {/* Title & Subtitle */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Unlock Your Financial Command Center
            </h2>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Expense logging, spending telemetry, bill renewals, and gullak goals in one unified space.
            </p>
          </div>

          {/* Social Action Button 1: Google (Clean Aesthetic Button) */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setForm({
                  username: "newuser",
                  email: "user@hisabkitab.com",
                  password: "password123",
                });
              }}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-3 text-sm cursor-pointer"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            {/* Social Action Button 2: Facebook / Demo */}
            <button
              type="button"
              onClick={() => {
                setForm({
                  username: "demouser",
                  email: "demo@hisabkitab.com",
                  password: "password123",
                });
              }}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-3 text-sm cursor-pointer"
            >
              <FacebookIcon className="w-4 h-4" />
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* Divider: "or" */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-4 text-xs uppercase tracking-wider text-slate-400 font-medium">
              or
            </span>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <input
                name="username"
                type="text"
                placeholder="Username"
                className={`w-full px-4 py-3.5 rounded-xl text-sm bg-white border transition-all outline-none text-slate-900 placeholder:text-slate-400 ${
                  errors.username
                    ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-[#00C58D] focus:ring-4 focus:ring-[#00C58D]/15"
                }`}
                value={form.username}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.username && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.username}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className={`w-full px-4 py-3.5 rounded-xl text-sm bg-white border transition-all outline-none text-slate-900 placeholder:text-slate-400 ${
                  errors.email
                    ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-[#00C58D] focus:ring-4 focus:ring-[#00C58D]/15"
                }`}
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full px-4 py-3.5 pr-10 rounded-xl text-sm bg-white border transition-all outline-none text-slate-900 placeholder:text-slate-400 ${
                  errors.password
                    ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-[#00C58D] focus:ring-4 focus:ring-[#00C58D]/15"
                }`}
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              {errors.password && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Primary Action Button: Emerald Green Matching Aesthetic */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00C58D] hover:bg-[#00b07e] active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl shadow-md shadow-[#00C58D]/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Terms of Use / Privacy Policy */}
          <div className="text-center mt-4">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              By creating an account, you agree to HisabKitab{" "}
              <span className="text-[#00C58D] cursor-pointer hover:underline font-medium">
                Terms of Use
              </span>
              ,{" "}
              <span className="text-[#00C58D] cursor-pointer hover:underline font-medium">
                Privacy Policy
              </span>
            </p>
          </div>

          {/* Bottom: "Already have an account? Log in ." */}
          <div className="text-center mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#00C58D] hover:underline"
              >
                Log in .
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Security Note */}
        <div className="text-center text-xs text-slate-400 pt-4">
          © 2026 HisabKitab. 100% Encrypted & Private.
        </div>
      </div>
    </div>
  );
}
