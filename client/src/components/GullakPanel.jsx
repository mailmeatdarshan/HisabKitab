import React, { useState, useEffect, useRef } from "react";
import lottie from "lottie-web";
import { getGullakGoals, saveGullakGoals, isUserAuthenticated, addGuestRecord } from "../utils/local-storage-helper";
import axiosInstance from "../utils/data-access";
import { Calendar, Plus, Trash2, PiggyBank, Sparkles, Loader, Clock, Coins, Check } from "lucide-react";

export default function GullakPanel({ records, onRefresh }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeGoalForDeposit, setActiveGoalForDeposit] = useState(null);
  const [activeGoalForDelete, setActiveGoalForDelete] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [celebratingGoal, setCelebratingGoal] = useState("");

  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    targetDate: ""
  });

  const mainLottieContainer = useRef(null);
  const mainLottieInstance = useRef(null);

  // Load Gullak Goals on mount
  useEffect(() => {
    setGoals(getGullakGoals());
  }, []);

  // Load Lottie Piggy Bank Animation
  useEffect(() => {
    if (mainLottieContainer.current) {
      mainLottieContainer.current.innerHTML = "";
      mainLottieInstance.current = lottie.loadAnimation({
        container: mainLottieContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/gullak.json" // Fetches from public folder
      });

      // Show initial frame
      mainLottieInstance.current.goToAndStop(0, true);
    }

    return () => {
      if (mainLottieInstance.current) {
        mainLottieInstance.current.destroy();
      }
    };
  }, []);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!form.name || !form.targetAmount || !form.targetDate) {
      alert("Please fill in all goal details.");
      return;
    }

    const newGoal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: form.name.trim(),
      targetAmount: parseFloat(form.targetAmount),
      currentAmount: 0,
      targetDate: form.targetDate,
      createdAt: new Date().toISOString(),
      history: []
    };

    const updated = [...goals, newGoal];
    setGoals(updated);
    saveGullakGoals(updated);

    setForm({
      name: "",
      targetAmount: "",
      targetDate: ""
    });
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }

    setLoading(true);
    const goal = activeGoalForDeposit;

    // 1. Record contribution in Gullak history
    const updatedGoals = goals.map((g) => {
      if (g.id === goal.id) {
        return {
          ...g,
          currentAmount: g.currentAmount + amt,
          history: [
            ...g.history,
            {
              id: `dep_${Date.now()}`,
              amount: amt,
              date: new Date().toISOString()
            }
          ]
        };
      }
      return g;
    });

    setGoals(updatedGoals);
    saveGullakGoals(updatedGoals);

    // 2. Automate saving record to Expense Ledger
    const todayStr = new Date().toISOString().split("T")[0];
    const details = {
      amount: amt,
      category: "Gullak",
      Date: todayStr,
      note: `[Gullak Deposit] ${goal.name}`
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

      // 3. Play Lottie coin animation & celebration toast
      if (mainLottieInstance.current) {
        mainLottieInstance.current.goToAndPlay(0, true);
      }

      setCelebratingGoal(goal.name);
      setShowCelebrate(true);
      setTimeout(() => {
        setShowCelebrate(false);
      }, 3500);

    } catch (error) {
      console.error("Failed to save Gullak transaction in ledger", error);
    } finally {
      setLoading(false);
      setActiveGoalForDeposit(null);
      setDepositAmount("");
    }
  };

  // Helper calculations for saving rates
  const getGoalCalculations = (goal) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(goal.targetDate);
    targetDate.setHours(0, 0, 0, 0);

    const timeDiff = targetDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const remaining = goal.targetAmount - goal.currentAmount;

    if (remaining <= 0) {
      return {
        completed: true,
        daysLeft: Math.max(0, daysLeft),
        remaining: 0,
        pct: 100,
        dailyRate: 0,
        weeklyRate: 0,
        monthlyRate: 0
      };
    }

    const pct = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);

    if (daysLeft <= 0) {
      return {
        completed: false,
        daysLeft: 0,
        remaining,
        pct,
        dailyRate: remaining,
        weeklyRate: remaining,
        monthlyRate: remaining
      };
    }

    const dailyRate = remaining / daysLeft;
    const weeklyRate = daysLeft < 7 ? remaining : remaining / (daysLeft / 7);
    const monthlyRate = daysLeft < 30 ? remaining : remaining / (daysLeft / 30.4);

    return {
      completed: false,
      daysLeft,
      remaining,
      pct,
      dailyRate,
      weeklyRate,
      monthlyRate
    };
  };

  const getMonthName = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", { month: "short", year: "numeric" });
  };

  const totalSavedAll = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTargetAll = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallPct = totalTargetAll > 0 ? (totalSavedAll / totalTargetAll) * 100 : 0;

  return (
    <div className="w-full mt-4">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        
        {/* Left Column: Visual pig rendering + active goals */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Visual Piggy Bank Display Card */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="w-44 h-44 md:w-52 md:h-52 bg-white rounded-2xl shadow-inner border border-amber-100/50 p-2 flex items-center justify-center overflow-hidden relative">
              <div ref={mainLottieContainer} className="w-full h-full" />
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                <PiggyBank className="w-3.5 h-3.5" />
                <span>Apna Gullak Box</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">Your Personal Savings Planner</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                Plan and track your savings goals. Deposits dynamically update goal progress and are automatically recorded in your transaction ledger to keep your monthly budget accurate.
              </p>
              
              {goals.length > 0 && (
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>Overall Goals Saved: ₹{totalSavedAll.toLocaleString("en-IN")}</span>
                    <span>{overallPct.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(overallPct, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Gullaks list */}
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <Coins className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-gray-800">Your Active Gullak Goals</h3>
            </div>
            
            {goals.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm italic">
                No savings goals created yet. Use the planner form on the right to start your first Gullak!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => {
                  const calc = getGoalCalculations(goal);
                  return (
                    <div 
                      key={goal.id} 
                      className={`flex flex-col justify-between p-5 border rounded-2xl shadow-sm transition-all bg-white relative overflow-hidden
                        ${calc.completed ? "border-emerald-200 bg-emerald-50/20" : "border-gray-200 hover:border-amber-300"}`}
                    >
                      {calc.completed && (
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-bl-lg flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Goal Reached!</span>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex justify-between items-start pr-12">
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">{goal.name}</h4>
                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              Target: {getMonthName(goal.targetDate)}
                            </span>
                          </div>
                          <span className="font-bold text-sm text-gray-500">
                            ₹{goal.targetAmount.toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                            <span>₹{goal.currentAmount.toLocaleString("en-IN")} saved</span>
                            <span>{calc.pct.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${calc.completed ? "bg-emerald-500" : "bg-amber-500"}`} 
                              style={{ width: `${calc.pct}%` }}
                            />
                          </div>
                        </div>

                        {/* Calculations section */}
                        {!calc.completed && (
                          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 border border-gray-100/50 mt-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                              Required Savings Targets
                            </span>
                            <div className="grid grid-cols-3 gap-1 text-center">
                              <div className="p-1">
                                <span className="text-[10px] text-gray-400 block">Daily</span>
                                <span className="text-xs font-bold text-gray-800">₹{Math.ceil(calc.dailyRate)}</span>
                              </div>
                              <div className="p-1 border-x border-gray-200">
                                <span className="text-[10px] text-gray-400 block">Weekly</span>
                                <span className="text-xs font-bold text-gray-800">₹{Math.ceil(calc.weeklyRate)}</span>
                              </div>
                              <div className="p-1">
                                <span className="text-[10px] text-gray-400 block">Monthly</span>
                                <span className="text-xs font-bold text-gray-800">₹{Math.ceil(calc.monthlyRate)}</span>
                              </div>
                            </div>
                            <span className="text-[10px] text-amber-600 font-semibold block text-center pt-1 border-t border-dashed border-gray-200/50">
                              {calc.daysLeft} days remaining to save ₹{calc.remaining.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Goal Actions */}
                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => setActiveGoalForDelete(goal)}
                          className="text-gray-400 hover:text-red-500 p-2 rounded-lg transition hover:bg-red-50 cursor-pointer"
                          title="Delete goal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {!calc.completed && (
                          <button
                            onClick={() => setActiveGoalForDeposit(goal)}
                            className="bg-black hover:bg-gray-950 text-white text-xs font-bold py-2 px-4 rounded-xl shadow hover:scale-[1.02] transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Deposit
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Add Gullak Planner Form */}
        <div className="lg:col-span-4 lg:border-l lg:border-gray-100 lg:pl-6">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <Plus className="w-5 h-5 text-gray-800" />
            <h3 className="text-lg font-bold text-gray-800">New Gullak Goal</h3>
          </div>

          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Goal Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dream Laptop, Emergency Fund"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-350 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Target Amount (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={form.targetAmount}
                onChange={(e) => handleInputChange("targetAmount", e.target.value)}
                className="w-full px-3 py-2 border border-gray-350 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => handleInputChange("targetDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-350 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 text-white py-2.5 rounded-lg text-sm font-bold shadow hover:bg-amber-600 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <Plus className="w-4 h-4" />
              Add Gullak Goal
            </button>
          </form>
        </div>

      </div>

      {/* Deposit Popup Modal */}
      {activeGoalForDeposit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 flex flex-col gap-5 relative">
            <button
              onClick={() => setActiveGoalForDeposit(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold transition focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>

            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-1">
                <PiggyBank className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Deposit into Gullak</h3>
              <p className="text-xs text-gray-500">
                Goal: <span className="font-semibold text-gray-800">{activeGoalForDeposit.name}</span>
              </p>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Amount to Deposit (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-350 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  autoFocus
                />
                <span className="text-[9px] text-gray-400 block mt-1 leading-normal">
                  Depositing money updates goal metrics and auto-records a saving transaction in your expense ledger.
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveGoalForDeposit(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition flex items-center justify-center gap-1"
                  disabled={loading}
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Deposit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {activeGoalForDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 flex flex-col gap-5 relative">
            <button
              onClick={() => setActiveGoalForDelete(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold transition focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>

            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-1">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Gullak Goal</h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to delete <span className="font-semibold text-gray-800">"{activeGoalForDelete.name}"</span>? All savings history for this goal will be permanently removed.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveGoalForDelete(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = goals.filter((g) => g.id !== activeGoalForDelete.id);
                  setGoals(updated);
                  saveGullakGoals(updated);
                  setActiveGoalForDelete(null);
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
