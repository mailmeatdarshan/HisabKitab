import { NavLink } from "react-router-dom";
import Logout from "./Logout";
import RecordFormModal from "./RecordForm";
import InputTextBox from "./InputTextBox";

export default function Navbar({ isOpen, onClose, setIsOpen, loading, isSummaryOpen, setIsSummaryOpen, onCloseSummary, fetchRecords }) {
  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/">
          <img title="Home" alt="logo" className="h-20 w-20 inline" src="/expenses.png" />
        </NavLink>
        <div className="flex items-center space-x-4">

          <button
            className={`px-4 py-1.5 rounded 
              ${loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "border border-black bg-black  px-4 py-1.5 rounded hover:bg-white hover:text-black transition duration-300 ease-in-out text-white  cursor-pointer"
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
                : "border border-black bg-black  px-4 py-1.5 rounded hover:bg-white hover:text-black transition duration-300 ease-in-out text-white  cursor-pointer"
              }`}
            onClick={() => setIsSummaryOpen(true)}
            disabled={loading}
          >
            Send Summary
          </button>
          <Logout />
          <RecordFormModal isOpen={isOpen} onClose={onClose} onRecordAdded={fetchRecords} />
          <InputTextBox isOpen={isSummaryOpen} onClose={onCloseSummary} />
        </div>
      </nav>
    </div>
  );
}