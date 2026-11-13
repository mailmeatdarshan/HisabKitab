import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  FileDown,
  Search,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
  CreditCard,
} from "lucide-react";
import {
  getLenDenParties,
  saveLenDenParties,
} from "../utils/local-storage-helper";
import { exportLenDenStatementPDF } from "../utils/lenden-pdf-helper";

export default function DebtsPanel({ onRefresh }) {
  const [parties, setParties] = useState([]);
  const [selectedPartyId, setSelectedPartyId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "lena" | "dena" | "settled"

  // Add party state
  const [newPartyName, setNewPartyName] = useState("");

  // Add entry modal state
  const [entryModal, setEntryModal] = useState({
    open: false,
    type: "give", // "give" (You Gave) or "get" (You Got)
  });
  const [entryForm, setEntryForm] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  useEffect(() => {
    setParties(getLenDenParties());
  }, []);

  const selectedParty = parties.find((p) => p.id === selectedPartyId) || null;

  // Party summary helper
  const getPartyStats = (party) => {
    const entries = party.entries || [];
    const totalGave = entries
      .filter((e) => e.type === "give")
      .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const totalGot = entries
      .filter((e) => e.type === "get")
      .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const netBalance = totalGave - totalGot;
    return { totalGave, totalGot, netBalance, count: entries.length };
  };

  // Global calculations
  const globalStats = parties.reduce(
    (acc, party) => {
      const { netBalance } = getPartyStats(party);
      if (netBalance > 0) acc.totalLena += netBalance;
      else if (netBalance < 0) acc.totalDena += Math.abs(netBalance);
      return acc;
    },
    { totalLena: 0, totalDena: 0 }
  );

  // Add New Party
  const handleAddParty = (e) => {
    e.preventDefault();
    const trimmed = newPartyName.trim();
    if (!trimmed) {
      alert("Please enter customer / party name.");
      return;
    }

    const newParty = {
      id: `party_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`,
      name: trimmed,
      createdAt: new Date().toISOString(),
      entries: [],
    };

    const updated = [newParty, ...parties];
    setParties(updated);
    saveLenDenParties(updated);
    setNewPartyName("");
    setSelectedPartyId(newParty.id);
  };

  // Delete Party
  const handleDeleteParty = (partyId) => {
    const p = parties.find((item) => item.id === partyId);
    if (!p) return;
    if (window.confirm(`Delete "${p.name}" and all their transaction records?`)) {
      const updated = parties.filter((item) => item.id !== partyId);
      setParties(updated);
      saveLenDenParties(updated);
      if (selectedPartyId === partyId) {
        setSelectedPartyId(null);
      }
    }
  };

  // Add Transaction Entry
  const handleSaveEntry = (e) => {
    e.preventDefault();
    const amt = parseFloat(entryForm.amount);
    if (!amt || amt <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }
    if (!entryForm.date) {
      alert("Please choose a date.");
      return;
    }

    const newEntry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`,
      type: entryModal.type,
      amount: amt,
      date: entryForm.date,
      note: entryForm.note.trim() || (entryModal.type === "give" ? "Given" : "Received"),
      createdAt: new Date().toISOString(),
    };

    const updated = parties.map((p) => {
      if (p.id === selectedPartyId) {
        return {
          ...p,
          entries: [...(p.entries || []), newEntry],
        };
      }
      return p;
    });

    setParties(updated);
    saveLenDenParties(updated);

    // Reset modal
    setEntryModal({ open: false, type: "give" });
    setEntryForm({
      amount: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
  };

  // Delete Transaction Entry
  const handleDeleteEntry = (entryId) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    const updated = parties.map((p) => {
      if (p.id === selectedPartyId) {
        return {
          ...p,
          entries: (p.entries || []).filter((e) => e.id !== entryId),
        };
      }
      return p;
    });

    setParties(updated);
    saveLenDenParties(updated);
  };

  // Filtered parties list
  const filteredParties = parties.filter((party) => {
    const matchesSearch = party.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    const { netBalance } = getPartyStats(party);
    if (statusFilter === "lena") return netBalance > 0;
    if (statusFilter === "dena") return netBalance < 0;
    if (statusFilter === "settled") return netBalance === 0;
    return true;
  });

  return (
    <div className="w-full mt-4 text-slate-900 dark:text-white">
      {/* ===================================================================== */}
      {/* TOP SUMMARY CARDS (Always visible)                                    */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total to Receive */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
              Total to Receive
            </span>
            <span className="text-2xl font-bold text-emerald-950 dark:text-emerald-200 mt-0.5 block">
              ₹{globalStats.totalLena.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total to Pay */}
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider block">
              Total to Pay
            </span>
            <span className="text-2xl font-bold text-rose-950 dark:text-rose-200 mt-0.5 block">
              ₹{globalStats.totalDena.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">
              Active Parties
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 block">
              {parties.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-200/70 dark:bg-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-300 shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VIEW 1: PARTIES DIRECTORY (When no party is selected)                 */}
      {/* ===================================================================== */}
      {!selectedParty ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Parties Directory (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#1C1C1E] p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800">
            {/* Header: Search and Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search customer / party name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00C58D] transition"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl text-xs font-semibold gap-1 self-start sm:self-auto overflow-x-auto max-w-full">
                {[
                  { id: "all", label: "All" },
                  { id: "lena", label: "To Receive" },
                  { id: "dena", label: "To Pay" },
                  { id: "settled", label: "Settled" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                      statusFilter === tab.id
                        ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Parties List */}
            {filteredParties.length === 0 ? (
              <div className="text-center py-16 px-4 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
                <Users className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-700 dark:text-zinc-300">
                  {searchQuery ? "No matching party found" : "No Len-Den parties yet"}
                </h4>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 max-w-sm mx-auto">
                  {searchQuery
                    ? "Try searching with a different name or clear the search filter."
                    : "Add your first party on the right to start recording transactions."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800/80 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                {filteredParties.map((party) => {
                  const { netBalance, count } = getPartyStats(party);
                  const lastEntry = party.entries && party.entries.length > 0 ? party.entries[party.entries.length - 1] : null;

                  return (
                    <div
                      key={party.id}
                      onClick={() => setSelectedPartyId(party.id)}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer transition group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full bg-[#00C58D]/10 text-[#00C58D] font-bold text-base flex items-center justify-center shrink-0 border border-[#00C58D]/20 group-hover:scale-105 transition-transform">
                          {party.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-[#00C58D] transition-colors truncate">
                            {party.name}
                          </h4>
                          <span className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-2 mt-0.5">
                            <span>{count} {count === 1 ? "entry" : "entries"}</span>
                            {lastEntry && (
                              <>
                                <span>•</span>
                                <span className="truncate">
                                  Last: {new Date(lastEntry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ({lastEntry.note})
                                </span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Right Balance Badge */}
                      <div className="text-right shrink-0 ml-3">
                        {netBalance > 0 ? (
                          <div className="text-right">
                            <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 block font-mono">
                              ₹{netBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                              To Receive
                            </span>
                          </div>
                        ) : netBalance < 0 ? (
                          <div className="text-right">
                            <span className="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400 block font-mono">
                              ₹{Math.abs(netBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800/40">
                              To Pay
                            </span>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="text-base sm:text-lg font-bold text-slate-400 dark:text-zinc-500 block font-mono">
                              ₹0.00
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                              Settled
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Add Party Form (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus className="w-5 h-5 text-[#00C58D]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add New Party / Customer
                </h3>
              </div>

              <form onSubmit={handleAddParty} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    Party / Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe, Ramesh Sharma"
                    value={newPartyName}
                    onChange={(e) => setNewPartyName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00C58D] text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#00C58D] hover:bg-[#00b07e] text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Party</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* ===================================================================== */
        /* VIEW 2: CUSTOMER DETAIL LEDGER (Drilldown View)                       */
        /* ===================================================================== */
        <div className="bg-white dark:bg-[#1C1C1E] p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 space-y-6">
          {/* Header Navigation & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedPartyId(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition cursor-pointer"
                title="Back to all parties"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#00C58D]/15 text-[#00C58D] font-extrabold text-lg flex items-center justify-center shrink-0 border border-[#00C58D]/30">
                  {selectedParty.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {selectedParty.name}
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">
                    Account created on {new Date(selectedParty.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => exportLenDenStatementPDF(selectedParty)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-sm font-semibold rounded-xl flex items-center gap-2 transition cursor-pointer"
                title="Export PDF Statement"
              >
                <FileDown className="w-4 h-4 text-[#00C58D]" />
                <span>Download Statement (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteParty(selectedParty.id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                title="Delete Customer Account"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Customer Balance Banner */}
          {(() => {
            const { totalGave, totalGot, netBalance } = getPartyStats(selectedParty);
            return (
              <div
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  netBalance > 0
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40"
                    : netBalance < 0
                    ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40"
                    : "bg-slate-50 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800"
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block text-slate-500 dark:text-zinc-400">
                    Current Net Settlement
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span
                      className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                        netBalance > 0
                          ? "text-emerald-700 dark:text-emerald-300"
                          : netBalance < 0
                          ? "text-rose-700 dark:text-rose-300"
                          : "text-slate-700 dark:text-zinc-300"
                      }`}
                    >
                      ₹{Math.abs(netBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`text-sm font-bold uppercase tracking-wider ${
                        netBalance > 0
                          ? "text-emerald-700 dark:text-emerald-300"
                          : netBalance < 0
                          ? "text-rose-700 dark:text-rose-300"
                          : "text-slate-500 dark:text-zinc-400"
                      }`}
                    >
                      {netBalance > 0 ? "• You will receive" : netBalance < 0 ? "• You need to pay" : "• Settled"}
                    </span>
                  </div>
                </div>

                {/* Sub breakdown */}
                <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-zinc-400 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-zinc-800 pt-3 sm:pt-0 sm:pl-6">
                  <div>
                    <span className="block text-slate-400 dark:text-zinc-500 uppercase font-bold text-[10px]">Total Given</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 font-mono text-sm">
                      ₹{totalGave.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400 dark:text-zinc-500 uppercase font-bold text-[10px]">Total Received</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                      ₹{totalGot.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Quick Action Entry Buttons */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setEntryModal({ open: true, type: "give" })}
              className="py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer text-sm sm:text-base"
            >
              <ArrowUpRight className="w-5 h-5" />
              <span>You Gave</span>
            </button>

            <button
              type="button"
              onClick={() => setEntryModal({ open: true, type: "get" })}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer text-sm sm:text-base"
            >
              <ArrowDownLeft className="w-5 h-5" />
              <span>You Got</span>
            </button>
          </div>

          {/* Transaction Ledger Table */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Transactions ({selectedParty.entries?.length || 0})
            </h4>

            {(!selectedParty.entries || selectedParty.entries.length === 0) ? (
              <div className="text-center py-12 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
                <CreditCard className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400">No transactions recorded yet</p>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                  Use the <strong>You Gave</strong> or <strong>You Got</strong> buttons above to add entries.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 dark:border-zinc-800 rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-zinc-900/80 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800">
                      <th className="p-3">Date</th>
                      <th className="p-3">Description / Note</th>
                      <th className="p-3 text-right">You Gave</th>
                      <th className="p-3 text-right">You Got</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                    {[...(selectedParty.entries || [])]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((entry) => {
                        const amt = parseFloat(entry.amount) || 0;
                        return (
                          <tr key={entry.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/30 transition">
                            <td className="p-3 whitespace-nowrap text-slate-600 dark:text-zinc-300">
                              {new Date(entry.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="p-3 font-medium text-slate-900 dark:text-white">
                              {entry.note}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                              {entry.type === "give" ? `₹${amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "-"}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {entry.type === "get" ? `₹${amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "-"}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="text-slate-400 hover:text-rose-500 transition p-1 cursor-pointer"
                                title="Delete Entry"
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
        </div>
      )}

      {/* ===================================================================== */}
      {/* ADD ENTRY MODAL                                                       */}
      {/* ===================================================================== */}
      {entryModal.open && selectedParty && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-5">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                    entryModal.type === "give" ? "bg-rose-600" : "bg-emerald-600"
                  }`}
                >
                  {entryModal.type === "give" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {entryModal.type === "give" ? "You Gave" : "You Got"}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">Party: {selectedParty.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEntryModal({ open: false, type: "give" })}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">₹</span>
                  <input
                    type="number"
                    step="any"
                    required
                    autoFocus
                    placeholder="0.00"
                    value={entryForm.amount}
                    onChange={(e) => setEntryForm({ ...entryForm, amount: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-lg font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#00C58D] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={entryForm.date}
                  onChange={(e) => setEntryForm({ ...entryForm, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00C58D] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Note / Item Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Invoice #102, Cash payment, Grocery items"
                  value={entryForm.note}
                  onChange={(e) => setEntryForm({ ...entryForm, note: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00C58D] text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEntryModal({ open: false, type: "give" })}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition cursor-pointer ${
                    entryModal.type === "give"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
