import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logout from "./Logout";
import RecordFormModal from "./RecordForm";
import InputTextBox from "./InputTextBox";

export default function Navbar({ isOpen, onClose, setIsOpen, loading, isSummaryOpen, setIsSummaryOpen, onCloseSummary, fetchRecords }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <nav className="flex justify-between items-center mb-4 md:mb-6">
        <NavLink to="/">
          <img title="Home" alt="logo" className="h-12 w-12 md:h-20 md:w-20 inline" src="/expenses.png" />
        </NavLink>

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
            onClick={() => setIsSummaryOpen(true)}
            disabled={loading}
          >
            Send Summary
          </button>
          <Logout />
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

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-2 pb-4 border-b border-gray-200 mb-4 animate-in">
          <button
            className={`w-full text-left px-4 py-2.5 rounded text-sm font-medium
              ${loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "border border-black bg-black text-white hover:bg-white hover:text-black transition duration-300 ease-in-out cursor-pointer"
              }`}
            onClick={() => { setIsOpen(true); setMenuOpen(false); }}
            disabled={loading}
          >
            Add Record
          </button>
          <button
            className={`w-full text-left px-4 py-2.5 rounded text-sm font-medium
              ${loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "border border-black bg-black text-white hover:bg-white hover:text-black transition duration-300 ease-in-out cursor-pointer"
              }`}
            onClick={() => { setIsSummaryOpen(true); setMenuOpen(false); }}
            disabled={loading}
          >
            Send Summary
          </button>
          <div className="mt-1">
            <Logout />
          </div>
        </div>
      )}

      <RecordFormModal isOpen={isOpen} onClose={onClose} onRecordAdded={fetchRecords} />
      <InputTextBox isOpen={isSummaryOpen} onClose={onCloseSummary} />
    </div>
  );
}