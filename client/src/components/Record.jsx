import { useState } from "react";
import axiosInstance from "../utils/data-access";

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
      await axiosInstance.delete(`/expanses/${_id}`);
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
      await axiosInstance.put(`/expanses/${_id}`, editForm);
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
      <div className="border rounded-lg p-4 bg-blue-50 shadow-sm">
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500">Amount</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-sm"
              value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Category</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-sm"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-sm"
              value={editForm.Date}
              onChange={(e) => setEditForm({ ...editForm, Date: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Note</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-sm"
              value={editForm.note}
              onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleEditSave}
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "..." : "Save"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditForm({ amount, category, Date: dateFormat, note: note || "" });
              }}
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm bg-gray-200 text-black rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <span className="text-lg font-bold">₹{amount}</span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{dateFormat}</span>
      </div>
      <div className="mb-1">
        <span className="text-sm font-medium text-gray-700">{category}</span>
      </div>
      {note && (
        <p className="text-xs text-gray-500 mb-3">{note}</p>
      )}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => setIsEditing(true)}
          disabled={loading}
          className="flex-1 px-3 py-1.5 text-xs border border-black bg-white text-black rounded hover:bg-black hover:text-white transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 px-3 py-1.5 text-xs border border-red-500 bg-white text-red-500 rounded hover:bg-red-500 hover:text-white transition"
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
      await axiosInstance.delete(`/expanses/${_id}`);
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
      await axiosInstance.put(`/expanses/${_id}`, editForm);
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
      <tr className="border-b transition-colors bg-blue-50">
        <td className="p-4 align-middle">
          <input
            type="number"
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            value={editForm.amount}
            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
          />
        </td>
        <td className="p-4 align-middle">
          <input
            type="text"
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            value={editForm.category}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
          />
        </td>
        <td className="p-4 align-middle">
          <input
            type="date"
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            value={editForm.Date}
            onChange={(e) => setEditForm({ ...editForm, Date: e.target.value })}
          />
        </td>
        <td className="p-4 align-middle">
          <input
            type="text"
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            value={editForm.note}
            onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
          />
        </td>
        <td className="p-4 align-middle">
          <div className="flex gap-2">
            <button
              onClick={handleEditSave}
              disabled={loading}
              className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "..." : "Save"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditForm({ amount, category, Date: dateFormat, note: note || "" });
              }}
              disabled={loading}
              className="px-3 py-1 text-sm bg-gray-200 text-black rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-4 align-middle">{amount}</td>
      <td className="p-4 align-middle">{category}</td>
      <td className="p-4 align-middle">{dateFormat}</td>
      <td className="p-4 align-middle">{note}</td>
      <td className="p-4 align-middle">
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="px-3 py-1 text-sm border border-black bg-white text-black rounded hover:bg-black hover:text-white transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1 text-sm border border-red-500 bg-white text-red-500 rounded hover:bg-red-500 hover:text-white transition"
          >
            {loading ? "..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
};