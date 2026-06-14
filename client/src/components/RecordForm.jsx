import { useState } from "react";
import axiosInstance from "../utils/data-access";
import { isUserAuthenticated, addGuestRecord } from "../utils/local-storage-helper";

export default function RecordFormModal({ isOpen, onClose, onRecordAdded }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    Date: "",
    note: ""
  });
  const [loading, setLoading] = useState(false);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const details = { ...form };
    if (!details.amount || !details.category || !details.Date) {
      alert("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      if (isUserAuthenticated()) {
        const response = await axiosInstance.post("/expanses", details);
        if (response.status === 201) {
          if (onRecordAdded) onRecordAdded();
        }
      } else {
        addGuestRecord(details);
        if (onRecordAdded) onRecordAdded();
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      setLoading(false);
      setForm({
        amount: "",
        category: "",
        Date: "",
        note: ""
      });
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 w-full bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-[92vw] max-w-md shadow-2xl p-5 md:p-10 relative flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{ outline: "none", border: "none" }}
      >
        <button
          className="absolute top-4 right-6 text-2xl text-gray-400 hover:text-black transition"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-8 text-black">Create Expanse Record</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-6 flex-1">
          <input
            type="number"
            name="amount"
            id="amount"
            className="block w-full px-5 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black transition"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => updateForm({ amount: e.target.value })}
            disabled={loading}
          />
          <input
            type="text"
            name="category"
            id="category"
            className="block w-full px-5 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black transition"
            placeholder="Category"
            value={form.category}
            onChange={(e) => updateForm({ category: e.target.value })}
            disabled={loading}
          />
          <input
            type="date"
            name="date"
            id="date"
            className="block w-full px-5 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black transition"
            value={form.Date}
            onChange={(e) => updateForm({ Date: e.target.value })}
            disabled={loading}
          />
          <input
            type="text"
            name="note"
            id="note"
            className="block w-full px-5 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black transition"
            placeholder="Note (optional)"
            value={form.note}
            onChange={(e) => updateForm({ note: e.target.value })}
            disabled={loading}
          />
          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-200 text-black font-bold py-3 rounded-lg shadow hover:bg-gray-300 border-2 border-black transition"
              disabled={loading}
            >
              Cancel
            </button>
            <input
              type="submit"
              value={loading ? "Saving..." : "Save Expanses Record"}
              className={`w-full bg-black text-white font-bold py-3 rounded-lg shadow hover:bg-white hover:text-black border-2 border-black transition cursor-pointer ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={loading}
            />
          </div>
          {loading && (
            <div className="flex justify-center items-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
              <span className="ml-3 text-black">Saving...</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
