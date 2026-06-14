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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        
        {/* Left column: Bills & active list */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Bills tracker */}
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <Calendar className="w-5 h-5 text-gray-800" />
              <h3 className="text-lg font-bold text-gray-800">
                Payment Dues for {getMonthName(currentMonth)} {currentYear}
              </h3>
            </div>
            {subs.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
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
                        ${dueInfo.status === "paid" ? "bg-gray-50 border-gray-150" : "bg-white border-gray-200 hover:border-gray-300"}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900 text-base">{sub.name}</h4>
                          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                            {sub.category}
                          </span>
                        </div>
                        <span className="font-bold text-lg text-black">
                          ₹{sub.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-dashed border-gray-100">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${dueInfo.badgeClass}`}>
                          {dueInfo.icon}
                          <span>{dueInfo.label}</span>
                        </div>

                        {dueInfo.status !== "paid" && (
                          <button
                            onClick={() => handleRecordPayment(sub)}
                            disabled={loading}
                            className="bg-black hover:bg-gray-950 text-white text-xs font-bold py-1.5 px-3 rounded shadow-sm hover:scale-[1.02] transition-all flex items-center gap-1 cursor-pointer"
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
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <CreditCard className="w-5 h-5 text-gray-800" />
              <h3 className="text-lg font-bold text-gray-800">Active Subscriptions</h3>
            </div>
            {subs.length === 0 ? (
              <div className="text-gray-400 text-sm italic">No recurring profiles configured.</div>
            ) : (
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th className="p-3">Subscription</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Billing Day</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {subs.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-semibold text-gray-950">{sub.name}</td>
                        <td className="p-3 text-gray-600">{sub.category}</td>
                        <td className="p-3 font-medium">₹{sub.amount.toLocaleString("en-IN")}</td>
                        <td className="p-3 text-gray-500">Day {sub.billingDay} of month</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteSub(sub.id)}
                            className="text-gray-400 hover:text-red-500 p-1.5 rounded transition hover:bg-red-50 cursor-pointer"
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
        <div className="lg:col-span-4 lg:border-l lg:border-gray-100 lg:pl-6">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <Plus className="w-5 h-5 text-gray-800" />
            <h3 className="text-lg font-bold text-gray-800">Add Subscription</h3>
          </div>
          
          <form onSubmit={handleAddSubscription} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="e.g. Netflix, Gym, Rent"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-350 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 199"
                value={form.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="w-full px-3 py-2 border border-gray-350 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Entertainment, Rent"
                value={form.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-350 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Billing Day of Month
              </label>
              <input
                type="number"
                min="1"
                max="31"
                placeholder="e.g. 15"
                value={form.billingDay}
                onChange={(e) => handleInputChange("billingDay", e.target.value)}
                className="w-full px-3 py-2 border border-gray-350 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <span className="text-[10px] text-gray-400 block mt-1">
                Select 1 to 31. Dues automatically activate on this day of the month.
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-bold shadow hover:bg-gray-950 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
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
