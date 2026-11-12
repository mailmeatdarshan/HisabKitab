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
      className="fixed inset-0 w-full bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl p-6 md:p-8 relative flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Create Expense Record</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 flex-1">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              className="block w-full px-4 py-2.5 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C58D] bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-white text-sm transition"
              placeholder="e.g. 250"
              value={form.amount}
              onChange={(e) => updateForm({ amount: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              id="category"
              className="block w-full px-4 py-2.5 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C58D] bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-white text-sm transition"
              placeholder="e.g. Food, Groceries, Travel"
              value={form.category}
              onChange={(e) => updateForm({ category: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              className="block w-full px-4 py-2.5 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C58D] bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-white text-sm transition"
              value={form.Date}
              onChange={(e) => updateForm({ Date: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              name="note"
              id="note"
              className="block w-full px-4 py-2.5 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C58D] bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-white text-sm transition"
              placeholder="e.g. Dinner with friends"
              value={form.note}
              onChange={(e) => updateForm({ note: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-semibold py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-[#00C58D] hover:bg-[#00B07D] text-white font-semibold py-2.5 rounded-lg shadow-sm transition flex items-center justify-center cursor-pointer ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? "Saving..." : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
