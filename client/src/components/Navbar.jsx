import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, CloudOff, Plus, Send } from "lucide-react";
import Logout from "./Logout";
import RecordFormModal from "./RecordForm";
import InputTextBox from "./InputTextBox";
import { isUserAuthenticated } from "../utils/local-storage-helper";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ isOpen, onClose, setIsOpen, loading, isSummaryOpen, setIsSummaryOpen, onCloseSummary, fetchRecords }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);
  const navigate = useNavigate();
  const authenticated = isUserAuthenticated();

  const handleSendSummaryClick = () => {
    if (!authenticated) {
      setShowAuthRequiredModal(true);
      return;
    }
    setIsSummaryOpen(true);
  };

  return (
    <div>
      <nav className="flex justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <NavLink to="/app">
            <img title="Home" alt="logo" className="h-12 w-12 md:h-20 md:w-20 inline" src="/expenses.png" />
          </NavLink>
          {!authenticated && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium animate-pulse shadow-sm">
              <CloudOff className="w-3.5 h-3.5" />
              <span>Guest Mode (Saved Locally)</span>
            </div>
          )}
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            className={`px-4 py-1.5 rounded 
              ${loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "border border-black bg-black px-4 py-1.5 rounded hover:bg-white hover:text-black transition duration-300 ease-in-out text-white cursor-pointer"
              }`}
            onClick={() => setIsOpen(true)}
            disabled={loading}
          >
            Add Record
          </button>
          <button
            className={`px-4 py-1.5 rounded 
              ${loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "border border-black bg-black px-4 py-1.5 rounded hover:bg-white hover:text-black transition duration-300 ease-in-out text-white cursor-pointer"
              }`}
            onClick={handleSendSummaryClick}
            disabled={loading}
          >
            Send Summary
          </button>
          {authenticated ? (
            <Logout />
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/login")}
                className="border border-black bg-white text-black px-4 py-1.5 rounded hover:bg-black hover:text-white transition duration-300 ease-in-out font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="border border-black bg-black text-white px-4 py-1.5 rounded hover:bg-white hover:text-black transition duration-300 ease-in-out font-medium"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile action bar */}
      <div className="flex md:hidden gap-3 mb-4">
        <button
          className={`flex-grow flex items-center justify-center gap-2 py-2.5 px-4 rounded text-sm font-semibold shadow-sm border border-black bg-black text-white hover:bg-white hover:text-black transition duration-300
            ${loading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
            }`}
          onClick={() => setIsOpen(true)}
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          Add Record
        </button>
        <button
          className={`flex-grow flex items-center justify-center gap-2 py-2.5 px-4 rounded text-sm font-semibold shadow-sm border border-black bg-white text-black hover:bg-black hover:text-white transition duration-300
            ${loading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
            }`}
          onClick={handleSendSummaryClick}
          disabled={loading}
        >
          <Send className="w-4 h-4" />
          Send Summary
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-2 pb-4 border-b border-gray-200 mb-4 animate-in">
          <div className="mt-1 flex flex-col gap-2">
            {authenticated ? (
              <Logout />
            ) : (
              <>
                <button
                  onClick={() => { navigate("/login"); setMenuOpen(false); }}
                  className="w-full text-center px-4 py-2.5 rounded text-sm font-medium border border-black bg-white text-black hover:bg-black hover:text-white transition duration-350"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate("/signup"); setMenuOpen(false); }}
                  className="w-full text-center px-4 py-2.5 rounded text-sm font-medium border border-black bg-black text-white hover:bg-white hover:text-black transition duration-350"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <RecordFormModal isOpen={isOpen} onClose={onClose} onRecordAdded={fetchRecords} />
      <InputTextBox isOpen={isSummaryOpen} onClose={onCloseSummary} />

      <AnimatePresence>
        {showAuthRequiredModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full border border-gray-100 flex flex-col gap-6 relative"
            >
              <button
                onClick={() => setShowAuthRequiredModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold transition focus:outline-none"
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Authentication Required</h3>
                <p className="text-sm text-gray-500">
                  Email reporting is only available for registered accounts. Please log in or sign up to use this feature!
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowAuthRequiredModal(false);
                    navigate("/login");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-950 transition text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setShowAuthRequiredModal(false);
                    navigate("/signup");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition text-center"
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