import React, { useState, useEffect } from "react";
import { Users, UserPlus, Trash2, CheckSquare, RefreshCw, TrendingUp, TrendingDown, Clock, AlertCircle } from "lucide-react";
import { getDebts, saveDebts, isUserAuthenticated, addGuestRecord } from "../utils/local-storage-helper";
import axiosInstance from "../utils/data-access";

export default function DebtsPanel({ onRefresh }) {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    person: "",
    type: "lent", // lent or borrowed
    amount: "",
    note: "",
    dueDate: ""
  });

  useEffect(() => {
    setDebts(getDebts());
  }, []);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddDebt = (e) => {
    e.preventDefault();
    if (!form.person || !form.amount || !form.dueDate) {
      alert("Please fill in Person Name, Amount, and Due Date.");
      return;
    }

    const newDebt = {
      id: `debt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      person: form.person.trim(),
      type: form.type,
      amount: parseFloat(form.amount),
      note: form.note.trim(),
      dueDate: form.dueDate,
      settled: false,
      settledDate: null
    };

    const updated = [...debts, newDebt];
    setDebts(updated);
    saveDebts(updated);

    setForm({
      person: "",
      type: "lent",
      amount: "",
      note: "",
      dueDate: ""
    });
  };

  const handleDeleteDebt = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const updated = debts.filter((d) => d.id !== id);
      setDebts(updated);
      saveDebts(updated);
    }
  };

  const handleSettleDebt = async (debt) => {
    if (!window.confirm(`Settle this debt of ₹${debt.amount} with ${debt.person}?`)) {
      return;
    }

    setLoading(true);
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

    // Balance ledger automatically
    const details = {
      // If we borrowed, repaying it is an expense (+)
      // If we lent, getting it back reduces our total monthly net expenses (-)
      amount: debt.type === "borrowed" ? debt.amount : -debt.amount,
      category: "Debt Settlement",
      Date: dateStr,
      note: debt.type === "borrowed" 
        ? `[Settle] Repaid borrowed ₹${debt.amount} to ${debt.person}` 
        : `[Settle] Received lent ₹${debt.amount} back from ${debt.person}`
    };

    try {
      if (isUserAuthenticated()) {
        const response = await axiosInstance.post("/expanses", details);
        if (response.status === 201) {
          if (onRefresh) await onRefresh();
        }
      } else {
        addGuestRecord(details);
        if (onRefresh) await onRefresh();
      }

      // Mark debt as settled in storage
      const updated = debts.map((d) => {
        if (d.id === debt.id) {
          return {
            ...d,
            settled: true,
            settledDate: dateStr
          };
        }
        return d;
      });

      setDebts(updated);
      saveDebts(updated);
    } catch (error) {
      console.error("Failed to settle debt record:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeDebts = debts.filter((d) => !d.settled);
  const settledDebts = debts.filter((d) => d.settled);

  const totalLent = activeDebts
    .filter((d) => d.type === "lent")
    .reduce((sum, d) => sum + d.amount, 0);

  const totalBorrowed = activeDebts
    .filter((d) => d.type === "borrowed")
    .reduce((sum, d) => sum + d.amount, 0);

  const getDueDateStatus = (dueDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `Overdue by ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? "day" : "days"}`,
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200 animate-pulse",
        icon: <AlertCircle className="w-3.5 h-3.5" />
      };
    } else if (diffDays === 0) {
      return {
        label: "Due Today",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <Clock className="w-3.5 h-3.5" />
      };
    } else {
      return {
        label: `Due in ${diffDays} ${diffDays === 1 ? "day" : "days"}`,
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Clock className="w-3.5 h-3.5" />
      };
    }
  };

  return (
    <div className="w-full mt-4">
      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">You Lent (To Receive)</span>
            <span className="text-2xl font-bold text-emerald-950">₹{totalLent.toLocaleString("en-IN")}</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-250 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">You Borrowed (To Pay)</span>
            <span className="text-2xl font-bold text-rose-950">₹{totalBorrowed.toLocaleString("en-IN")}</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Left: Outstanding & Settle History */}
        <div className="lg:col-span-8 space-y-8">
          {/* Outstanding Debts */}
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <Users className="w-5 h-5 text-gray-800" />
              <h3 className="text-lg font-bold text-gray-800">Outstanding Debts</h3>
            </div>

            {activeDebts.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No outstanding debts. Add a record on the right to start tracking lending & borrowing.
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th className="p-3">Person</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Due Date & Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {activeDebts.map((debt) => {
                      const dueInfo = getDueDateStatus(debt.dueDate);
                      return (
                        <tr key={debt.id} className="hover:bg-gray-50/50">
                          <td className="p-3">
                            <span className="font-semibold text-gray-950 block">{debt.person}</span>
                            {debt.note && <span className="text-xs text-gray-400">{debt.note}</span>}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border
                              ${debt.type === "lent" 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                : "bg-rose-50 text-rose-700 border-rose-100"}`}
                            >
                              {debt.type === "lent" ? "Lent" : "Borrowed"}
                            </span>
                          </td>
                          <td className={`p-3 font-bold text-base ${debt.type === "lent" ? "text-emerald-700" : "text-rose-700"}`}>
                            ₹{debt.amount.toLocaleString("en-IN")}
                          </td>
                          <td className="p-3">
                            <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${dueInfo.badgeClass}`}>
                              {dueInfo.icon}
                              <span>{dueInfo.label}</span>
                            </div>
                          </td>
                          <td className="p-3 text-right flex justify-end gap-1 items-center">
                            <button
                              onClick={() => handleSettleDebt(debt)}
                              disabled={loading}
                              className="text-gray-500 hover:text-black p-1.5 rounded transition hover:bg-gray-100 cursor-pointer flex items-center gap-1 text-xs font-bold"
                              title="Mark as Settled"
                            >
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                              Settle
                            </button>
                            <button
                              onClick={() => handleDeleteDebt(debt.id)}
                              className="text-gray-400 hover:text-red-500 p-1.5 rounded transition hover:bg-red-50 cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Settled History */}
          {settledDebts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                <RefreshCw className="w-4 h-4 text-gray-500" />
                <h3 className="text-base font-bold text-gray-600">Settle History</h3>
              </div>
              <div className="overflow-x-auto border border-gray-100 rounded-xl opacity-75">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th className="p-3">Person</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Settled Date</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-500">
                    {settledDebts.map((debt) => (
                      <tr key={debt.id} className="hover:bg-gray-50/50">
                        <td className="p-3">
                          <span className="font-semibold text-gray-700 block line-through">{debt.person}</span>
                          {debt.note && <span className="text-[10px] text-gray-400">{debt.note}</span>}
                        </td>
                        <td className="p-3">
                          <span className="text-[9px] font-bold uppercase tracking-wider">
                            {debt.type === "lent" ? "Lent" : "Borrowed"}
                          </span>
                        </td>
                        <td className="p-3 font-semibold">
                          ₹{debt.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3">{debt.settledDate || "Yes"}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteDebt(debt.id)}
                            className="text-gray-400 hover:text-red-500 p-1.5 rounded transition hover:bg-red-50 cursor-pointer"
                            title="Delete history"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Add Form */}
        <div className="lg:col-span-4 lg:border-l lg:border-gray-100 lg:pl-6">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <UserPlus className="w-5 h-5 text-gray-800" />
            <h3 className="text-lg font-bold text-gray-800">Add Debt Entry</h3>
          </div>

          <form onSubmit={handleAddDebt} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Person Name
              </label>
              <input
                type="text"
                placeholder="e.g. Vivek, Amit, Neha"
                value={form.person}
                onChange={(e) => handleInputChange("person", e.target.value)}
                className="w-full px-3 py-2 border border-gray-350 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Transaction Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange("type", "lent")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer
                    ${form.type === "lent"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-600"
                      : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  I Lent Money
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("type", "borrowed")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer
                    ${form.type === "borrowed"
                      ? "bg-rose-50 text-rose-700 border-rose-600"
                      : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  I Borrowed Money
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={form.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="w-full px-3 py-2 border border-gray-350 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Note / Description
              </label>
              <input
                type="text"
                placeholder="e.g. Lunch split, movie ticket"
                value={form.note}
                onChange={(e) => handleInputChange("note", e.target.value)}
                className="w-full px-3 py-2 border border-gray-350 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-350 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-bold shadow hover:bg-gray-950 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <UserPlus className="w-4 h-4" />
              Add Debt Record
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
