import React, { useState, useEffect } from "react";
import { CreditCard, Calendar, Plus, Trash2, CheckCircle, AlertCircle, Clock, Loader } from "lucide-react";
import { getSubscriptions, saveSubscriptions, isUserAuthenticated, addGuestRecord } from "../utils/local-storage-helper";
import axiosInstance from "../utils/data-access";

export default function SubscriptionsPanel({ records, onRefresh }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
    billingDay: "1"
  });

  useEffect(() => {
    setSubs(getSubscriptions());
  }, []);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubscription = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.category || !form.billingDay) {
      alert("Please fill in all subscription details.");
      return;
    }

    const newSub = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: form.name.trim(),
      amount: parseFloat(form.amount),
      category: form.category.trim(),
      billingDay: Math.max(1, Math.min(31, parseInt(form.billingDay, 10)))
    };

    const updated = [...subs, newSub];
    setSubs(updated);
    saveSubscriptions(updated);
    
    setForm({
      name: "",
      amount: "",
      category: "",
      billingDay: "1"
    });
  };

  const handleDeleteSub = (id) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      const updated = subs.filter((s) => s.id !== id);
      setSubs(updated);
      saveSubscriptions(updated);
    }
  };

  const handleRecordPayment = async (sub) => {
    setLoading(true);
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
    
    const details = {
      amount: sub.amount,
      category: sub.category,
      Date: dateStr,
      note: `[Subscription] ${sub.name}`
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
    } catch (error) {
      console.error("Failed to record subscription payment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dues tracking logic
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();

  const getMonthName = (monthIdx) => {
    return [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ][monthIdx];
  };

  const getDuesStatus = (sub) => {
    // Find matching expense in the current month/year
    const matchingExpense = records.find((record) => {
      const recordDateStr = record.Date.split("T")[0];
      const recordDate = new Date(recordDateStr);
      
      const categoryMatch = record.category.toLowerCase() === sub.category.toLowerCase();
      const nameMatch = record.note && record.note.toLowerCase().includes(sub.name.toLowerCase());
      const monthMatch = recordDate.getMonth() === currentMonth;
      const yearMatch = recordDate.getFullYear() === currentYear;

      return categoryMatch && nameMatch && monthMatch && yearMatch;
    });

    if (matchingExpense) {
      return {
        status: "paid",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
        label: `Paid on ${new Date(matchingExpense.Date).getDate()} ${getMonthName(currentMonth).substring(0, 3)}`,
        expense: matchingExpense
      };
    }

    if (currentDay >= sub.billingDay) {
      return {
        status: "overdue",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200 animate-pulse",
        icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
        label: `Due on ${sub.billingDay}th (Unpaid)`,
      };
    }

    const daysLeft = sub.billingDay - currentDay;
    return {
      status: "upcoming",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock className="w-4 h-4 text-amber-500" />,
      label: `Due in ${daysLeft} ${daysLeft === 1 ? "day" : "days"} (${sub.billingDay}th)`,
    };
  };

  return (
    <div className="w-full mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white">
        
        {/* Left column: Bills & active list */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Bills tracker */}
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-zinc-800 pb-2">
              <Calendar className="w-5 h-5 text-slate-700 dark:text-zinc-200" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Payment Dues for {getMonthName(currentMonth)} {currentYear}
              </h3>
            </div>
            {subs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-zinc-500 text-sm">
                No active subscriptions. Add one on the right to start tracking bills.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subs.map((sub) => {
                  const dueInfo = getDuesStatus(sub);
                  return (
                    <div 
                      key={sub.id} 
                      className={`flex flex-col justify-between p-4 border rounded-xl shadow-sm transition-all
                        ${dueInfo.status === "paid" ? "bg-slate-50 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800" : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600"}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">{sub.name}</h4>
                          <span className="text-xs text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-medium">
                            {sub.category}
                          </span>
                        </div>
                        <span className="font-bold text-lg text-slate-900 dark:text-white">
                          ₹{sub.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-dashed border-slate-100 dark:border-zinc-800">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${dueInfo.badgeClass}`}>
                          {dueInfo.icon}
                          <span>{dueInfo.label}</span>
                        </div>

                        {dueInfo.status !== "paid" && (
                          <button
                            onClick={() => handleRecordPayment(sub)}
                            disabled={loading}
                            className="bg-[#00C58D] hover:bg-[#00b07e] text-white text-xs font-bold py-1.5 px-3.5 rounded-lg shadow-sm hover:scale-[1.02] transition-all flex items-center gap-1 cursor-pointer"
                          >
                            {loading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : "Pay"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Subscriptions list */}
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-zinc-800 pb-2">
              <CreditCard className="w-5 h-5 text-slate-700 dark:text-zinc-200" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Subscriptions</h3>
            </div>
            {subs.length === 0 ? (
              <div className="text-slate-400 dark:text-zinc-500 text-sm italic">No recurring profiles configured.</div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 dark:border-zinc-800 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-zinc-900/80 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800">
                      <th className="p-3">Subscription</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Billing Day</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
                    {subs.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">{sub.name}</td>
                        <td className="p-3 text-slate-600 dark:text-zinc-300">{sub.category}</td>
                        <td className="p-3 font-medium text-slate-900 dark:text-white">₹{sub.amount.toLocaleString("en-IN")}</td>
                        <td className="p-3 text-slate-500 dark:text-zinc-400">Day {sub.billingDay} of month</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteSub(sub.id)}
                            className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                            title="Delete subscription"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right column: Add subscription form */}
        <div className="lg:col-span-4 lg:border-l lg:border-slate-100 dark:lg:border-zinc-800 lg:pl-6">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
            <Plus className="w-5 h-5 text-slate-700 dark:text-zinc-200" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Subscription</h3>
          </div>
          
          <form onSubmit={handleAddSubscription} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="e.g. Netflix, Gym, Rent"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00C58D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 199"
                value={form.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00C58D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Entertainment, Rent"
                value={form.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00C58D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase mb-1">
                Billing Day of Month
              </label>
              <input
                type="number"
                min="1"
                max="31"
                placeholder="e.g. 15"
                value={form.billingDay}
                onChange={(e) => handleInputChange("billingDay", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00C58D]"
                required
              />
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block mt-1">
                Select 1 to 31. Dues automatically activate on this day of the month.
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00C58D] hover:bg-[#00b07e] text-white py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#00C58D]/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <Plus className="w-4 h-4" />
              Add Subscription
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
