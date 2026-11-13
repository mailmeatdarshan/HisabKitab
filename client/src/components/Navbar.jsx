import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Plus, Send } from "lucide-react";
import Logout from "./Logout";
import RecordFormModal from "./RecordForm";
import InputTextBox from "./InputTextBox";
import { CustomSidebarIcon } from "./Sidebar";
import { isUserAuthenticated } from "../utils/local-storage-helper";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({
  isOpen,
  onClose,
  setIsOpen,
  loading,
  isSummaryOpen,
  setIsSummaryOpen,
  onCloseSummary,
  fetchRecords,
  setIsSidebarOpen
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isUserAuthenticated();

  const getScreenTitle = () => {
    const path = location.pathname;
    if (path === "/app/recordlist") return "Expenses";
    if (path === "/app/debts") return "Len-Den";
    if (path === "/app/subscriptions") return "Subscriptions";
    if (path === "/app/gullak") return "Gullak";
    if (path === "/app/settings") return "Settings";
    return "Analytics";
  };

  const screenTitle = getScreenTitle();

  const handleSendSummaryClick = () => {
    if (!authenticated) {
      setShowAuthRequiredModal(true);
      return;
    }
    setIsSummaryOpen(true);
  };

  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);

  return (
    <div>
      {/* ================================================================= */}
      {/* DESKTOP NAVBAR                                                    */}
      {/* ================================================================= */}
      <nav className="hidden md:flex justify-between items-center mb-6 py-2">
        <div className="flex items-center gap-3">
          <NavLink to="/app" className="flex items-center gap-3">
            <img title="Home" alt="logo" className="h-10 w-10 lg:h-12 lg:w-12 object-contain" src="/expenses.png" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {screenTitle}
            </h1>
          </NavLink>
        </div>

        {/* Desktop action buttons */}
        <div className="flex items-center space-x-3">
          <button
            className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition duration-200 cursor-pointer flex items-center gap-2
              ${loading
                ? "bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed"
                : "bg-[#00C58D] hover:bg-[#00b07e] text-white shadow-[#00C58D]/20 active:scale-95"
              }`}
            onClick={() => setIsOpen(true)}
            disabled={loading}
          >
            <Plus className="w-4 h-4" />
            Add Record
          </button>
          <button
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition duration-200 cursor-pointer flex items-center gap-2
              ${loading
                ? "border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed"
                : "border-slate-200 dark:border-zinc-700 bg-white dark:bg-[#1C1C1E] text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800"
              }`}
            onClick={handleSendSummaryClick}
            disabled={loading}
          >
            <Send className="w-4 h-4" />
            Send Summary
          </button>
          {authenticated ? (
            <Logout />
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/login")}
                className="border border-slate-200 dark:border-zinc-700 bg-white dark:bg-[#1C1C1E] text-slate-800 dark:text-zinc-200 px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition font-medium text-sm cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-[#00C58D] hover:bg-[#00b07e] text-white px-4 py-2 rounded-xl transition font-medium text-sm shadow-sm cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ================================================================= */}
      {/* CLEAN & HANDY MOBILE APP BAR (Parkin-son Style Trigger + Screen)   */}
      {/* ================================================================= */}
      <div className="flex md:hidden items-center justify-between py-2 px-1 mb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen && setIsSidebarOpen(true)}
            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#1C1C1E] text-slate-800 dark:text-zinc-200 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
            aria-label="Open Navigation Sidebar"
          >
            <CustomSidebarIcon />
          </button>

          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {screenTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSendSummaryClick}
            disabled={loading}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#1C1C1E] text-slate-700 dark:text-zinc-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-zinc-800 transition shadow-sm cursor-pointer"
            title="Send Monthly Summary"
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            disabled={loading}
            className="py-2 px-3.5 rounded-xl bg-[#00C58D] hover:bg-[#00b07e] text-white text-xs font-bold shadow-md shadow-[#00C58D]/25 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      <RecordFormModal isOpen={isOpen} onClose={onClose} onRecordAdded={fetchRecords} />
      <InputTextBox isOpen={isSummaryOpen} onClose={onCloseSummary} />

      <AnimatePresence>
        {showAuthRequiredModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full border border-slate-200 dark:border-zinc-800 flex flex-col gap-6 relative"
            >
              <button
                onClick={() => setShowAuthRequiredModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold transition focus:outline-none cursor-pointer"
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Authentication Required</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Email reporting is only available for registered accounts. Please log in or sign up to use this feature!
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowAuthRequiredModal(false);
                    navigate("/login");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#00C58D] hover:bg-[#00b07e] text-white text-sm font-semibold transition text-center cursor-pointer shadow-sm"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setShowAuthRequiredModal(false);
                    navigate("/signup");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-700 transition text-center cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}