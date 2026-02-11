import { useState } from "react";
import axiosInstance from "../utils/data-access";

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