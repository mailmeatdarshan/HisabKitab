import { useState } from "react";
import axiosInstance from "../utils/data-access";
import { isUserAuthenticated, updateGuestRecord, deleteGuestRecord } from "../utils/local-storage-helper";

// Card view for mobile
export const RecordCard = ({ record, onDelete, onRefresh }) => {
  const { _id, amount, category, Date: dateVal, note } = record;
  const dateFormat = dateVal.split("T")[0];

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    amount: amount,
    category: category,
    Date: dateFormat,
    note: note || "",
  });
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setLoading(true);
    try {
      if (isUserAuthenticated()) {
        await axiosInstance.delete(`/expanses/${_id}`);
      } else {
        deleteGuestRecord(_id);
      }
      if (onDelete) onDelete(_id);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete record.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!editForm.amount || !editForm.category || !editForm.Date) {
      alert("Amount, category, and date are required.");
      return;
    }
    setLoading(true);
    try {
      if (isUserAuthenticated()) {
        await axiosInstance.put(`/expanses/${_id}`, editForm);
      } else {
        updateGuestRecord(_id, editForm);
      }
      setIsEditing(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update record.");
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-4 bg-slate-50 dark:bg-zinc-900/80 shadow-sm">
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Amount</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C58D] text-sm"
              value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Category</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C58D] text-sm"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C58D] text-sm"
              value={editForm.Date}
              onChange={(e) => setEditForm({ ...editForm, Date: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Note</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C58D] text-sm"
              value={editForm.note}
              onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleEditSave}
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm bg-[#00C58D] hover:bg-[#00b07e] text-white rounded-lg font-semibold transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {loading ? "..." : "Save"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditForm({ amount, category, Date: dateFormat, note: note || "" });
              }}
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-[#1C1C1E] shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <span className="text-lg font-bold text-slate-900 dark:text-white">₹{amount}</span>
        <span className="text-xs text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full font-medium">{dateFormat}</span>
      </div>
      <div className="mb-1">
        <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{category}</span>
      </div>
      {note && (
        <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">{note}</p>
      )}
      <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
        <button
          onClick={() => setIsEditing(true)}
          disabled={loading}
          className="flex-1 px-3 py-1.5 text-xs border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700 transition font-medium cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 px-3 py-1.5 text-xs border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition font-medium cursor-pointer"
        >
          {loading ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

// Table row view for desktop
export const Record = ({ record, onDelete, onRefresh }) => {
  const { _id, amount, category, Date: dateVal, note } = record;
  const dateFormat = dateVal.split("T")[0];

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    amount: amount,
    category: category,
    Date: dateFormat,
    note: note || "",
  });
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setLoading(true);
    try {
      if (isUserAuthenticated()) {
        await axiosInstance.delete(`/expanses/${_id}`);
      } else {
        deleteGuestRecord(_id);
      }
      if (onDelete) onDelete(_id);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete record.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!editForm.amount || !editForm.category || !editForm.Date) {
      alert("Amount, category, and date are required.");
      return;
    }
    setLoading(true);
    try {
      if (isUserAuthenticated()) {
        await axiosInstance.put(`/expanses/${_id}`, editForm);
      } else {
        updateGuestRecord(_id, editForm);
      }
      setIsEditing(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update record.");
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <tr className="border-b border-slate-200 dark:border-zinc-800 transition-colors bg-slate-50 dark:bg-zinc-900/60">
        <td className="p-4 align-middle">
          <input
            type="number"
            className="w-full px-2 py-1 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-[#00C58D]"
            value={editForm.amount}
            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
          />
        </td>
        <td className="p-4 align-middle">
          <input
            type="text"
            className="w-full px-2 py-1 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-[#00C58D]"
            value={editForm.category}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
          />
        </td>
        <td className="p-4 align-middle">
          <input
            type="date"
            className="w-full px-2 py-1 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-[#00C58D]"
            value={editForm.Date}
            onChange={(e) => setEditForm({ ...editForm, Date: e.target.value })}
          />
        </td>
        <td className="p-4 align-middle">
          <input
            type="text"
            className="w-full px-2 py-1 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-[#00C58D]"
            value={editForm.note}
            onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
          />
        </td>
        <td className="p-4 align-middle">
          <div className="flex gap-2">
            <button
              onClick={handleEditSave}
              disabled={loading}
              className="px-3 py-1.5 text-xs bg-[#00C58D] hover:bg-[#00b07e] text-white rounded-lg font-semibold transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {loading ? "..." : "Save"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditForm({ amount, category, Date: dateFormat, note: note || "" });
              }}
              disabled={loading}
              className="px-3 py-1.5 text-xs border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-slate-100 dark:border-zinc-800/80 transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 text-slate-800 dark:text-zinc-200">
      <td className="p-4 align-middle font-bold text-slate-900 dark:text-white">₹{amount}</td>
      <td className="p-4 align-middle font-medium text-slate-700 dark:text-zinc-300">{category}</td>
      <td className="p-4 align-middle text-slate-500 dark:text-zinc-400 text-xs">{dateFormat}</td>
      <td className="p-4 align-middle text-slate-600 dark:text-zinc-400 text-sm">{note || "—"}</td>
      <td className="p-4 align-middle">
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="px-3 py-1 text-xs border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700 transition font-medium cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1 text-xs border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition font-medium cursor-pointer"
          >
            {loading ? "..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
};