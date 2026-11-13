import { ChartArea, FileSpreadsheet, Loader, CreditCard, Edit2, Check, X, Users, PiggyBank, Settings2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import RecordList from "./RecordList";
import SpreadChart from "../components/SpendingCharts";
import SubscriptionsPanel from "./SubscriptionsPanel";
import DebtsPanel from "./DebtsPanel";
import GullakPanel from "./GullakPanel";
import SettingsPanel from "./SettingsPanel";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/data-access";
import { isUserAuthenticated, filterGuestRecords, getGuestSummary, getBudget, saveBudget } from "../utils/local-storage-helper";
import { useSettings } from "../context/SettingsContext";
import { HISABKITAB_LOGO } from "../utils/logo-data";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Dashboard = ({ records, onDelete, onRefresh }) => {
  const { theme } = useSettings();
  const isDark = theme === "dark";
  const [monthFilter, setMonthFilter] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filteredRecordsChart, setFilteredRecordsChart] = useState([]);
  const [dateFilterChart, setDateFilterChart] = useState("");
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(0);
  const [editBudgetMode, setEditBudgetMode] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  const isChart = location.pathname === "/app";
  const isSubscriptions = location.pathname === "/app/subscriptions";
  const isDebts = location.pathname === "/app/debts";
  const isGullak = location.pathname === "/app/gullak";
  const isSettings = location.pathname === "/app/settings";

  useEffect(() => {
    const b = getBudget();
    setBudget(b);
    setBudgetInput(b > 0 ? b.toString() : "");
  }, [records]);

  const handleFilterRecords = async () => {
    try {
      setLoading(true);
      if (!categoryFilter && !dateFilter) {
        setFilteredRecords(records);
        setLoading(false);
        return;
      }
      if (isUserAuthenticated()) {
        if (categoryFilter && dateFilter) {
          const response = await axiosInstance.get(
            `/expanses/filterBy?category=${categoryFilter}&Date=${dateFilter}`
          );
          const responseData = response.data;
          setFilteredRecords(responseData.data || []);
        } else if (categoryFilter) {
          if (categoryFilter === "") {
            setFilteredRecords(records);
            setLoading(false);
            return;
          }
          const response = await axiosInstance.get(
            `/expanses/filterBy?category=${categoryFilter}`
          );
          const responseData = response.data;
          setFilteredRecords(responseData.data || []);
        } else if (dateFilter) {
          const response = await axiosInstance.get(
            `/expanses/filterBy?Date=${dateFilter}`
          );
          const responseData = response.data;
          setFilteredRecords(responseData.data || []);
        }
      } else {
        const filtered = filterGuestRecords(records, categoryFilter, dateFilter);
        setFilteredRecords(filtered);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterRecordsChart = async (selectedMonthIdx) => {
    try {
      setLoading(true);
      if (
        selectedMonthIdx === "" ||
        selectedMonthIdx === undefined ||
        selectedMonthIdx === null ||
        isNaN(selectedMonthIdx) ||
        selectedMonthIdx < 0
      ) {
        setDateFilterChart("");
        setFilteredRecordsChart([]);
        setLoading(false);
        return;
      }
      const month = String(selectedMonthIdx + 1).padStart(2, "0");
      const year = new Date().getFullYear();
      const selectedDate = `${year}-${month}-01`;
      setDateFilterChart(selectedDate);

      if (isUserAuthenticated()) {
        const response = await axiosInstance.get(
          `/expanses/summary?Date=${selectedDate}`
        );
        const responseData = response.data;
        setFilteredRecordsChart(responseData.data || []);
      } else {
        const summary = getGuestSummary(records, selectedDate);
        setFilteredRecordsChart(summary);
      }
    } catch (error) {
      console.error(error);
      setDateFilterChart("");
      setFilteredRecordsChart([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthDropdownChange = async (e) => {
    const rawVal = e.target.value;
    setMonthFilter(rawVal);
    if (!rawVal || rawVal === "") {
      setDateFilterChart("");
      setFilteredRecordsChart([]);
      return;
    }
    const selectedMonthIdx = parseInt(rawVal, 10) - 1;
    if (isNaN(selectedMonthIdx) || selectedMonthIdx < 0 || selectedMonthIdx > 11) {
      setDateFilterChart("");
      setFilteredRecordsChart([]);
      return;
    }
    await handleFilterRecordsChart(selectedMonthIdx);
  };

  const handleExportCSV = () => {
    const recordsToExport = filteredRecords.length > 0 ? filteredRecords : records;
    if (recordsToExport.length === 0) {
      alert("No records to export.");
      return;
    }
    const headers = ["Amount (INR)", "Category", "Date", "Note"];
    const csvRows = [
      headers.join(","),
      ...recordsToExport.map(r => {
        const amt = parseFloat(r.amount);
        return [
          amt,
          `"${r.category.replace(/"/g, '""')}"`,
          r.Date.split("T")[0],
          `"${(r.note || "").replace(/"/g, '""')}"`
        ].join(",");
      })
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `hisabkitab_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const recordsToExport = filteredRecords.length > 0 ? filteredRecords : records;
    if (recordsToExport.length === 0) {
      alert("No records to export.");
      return;
    }
    
    // Calculate summaries
    const totalSpent = recordsToExport.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    
    // Category breakdowns
    const categoryBreakdown = {};
    recordsToExport.forEach(r => {
      categoryBreakdown[r.category] = (categoryBreakdown[r.category] || 0) + parseFloat(r.amount);
    });
    
    const sortedCategories = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]);
    
    const printWindow = window.open("", "_blank");
    
    // Create HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>HisabKitab - Spending Report</title>
        <style>
          body {
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            color: #1a1c1e;
            margin: 0;
            padding: 40px;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #1f2bc8;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo {
            width: 44px;
            height: 44px;
          }
          .brand-name {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.04em;
            color: #1a1c1e;
          }
          .report-title {
            text-align: right;
          }
          .report-title h1 {
            margin: 0;
            font-size: 20px;
            color: #1f2bc8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .report-title p {
            margin: 5px 0 0 0;
            font-size: 12px;
            color: #64748b;
          }
          .summary-grid {
            display: grid;
            grid-template-cols: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .summary-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
          }
          .summary-card.primary {
            background: #f0f2ff;
            border-color: #c7cdff;
          }
          .card-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 5px;
          }
          .card-value {
            font-size: 24px;
            font-weight: 800;
            color: #1a1c1e;
          }
          .card-value.primary {
            color: #1f2bc8;
          }
          .section-title {
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
            color: #64748b;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            margin-top: 30px;
            margin-bottom: 15px;
          }
          .category-list {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 30px;
          }
          .category-item {
            background: #f1f5f9;
            border-radius: 8px;
            padding: 8px 15px;
            font-size: 13px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .category-dot {
            width: 10px;
            height: 10px;
            border-radius: 50px;
            background: #1f2bc8;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            margin-top: 15px;
          }
          th {
            background: #f8fafc;
            color: #64748b;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 12px;
            border-bottom: 2px solid #e2e8f0;
          }
          td {
            padding: 12px;
            font-size: 13px;
            border-bottom: 1px solid #e2e8f0;
          }
          tr:nth-child(even) td {
            background: rgba(248, 250, 252, 0.5);
          }
          .amount {
            font-weight: 700;
          }
          .amount.expense {
            color: #ba1a1a;
          }
          .amount.credit {
            color: #10b981;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 11px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
          }
          @media print {
            body {
              padding: 0;
            }
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            <img class="logo" src="${HISABKITAB_LOGO}" alt="HisabKitab Logo" />
            <span class="brand-name">HisabKitab</span>
          </div>
          <div class="report-title">
            <h1>Spending Statement</h1>
            <p>Generated on ${new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        
        <div class="summary-grid">
          <div class="summary-card primary">
            <div class="card-label">Total Expenditures</div>
            <div class="card-value primary">₹${totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          </div>
          <div class="summary-card">
            <div class="card-label">Total Transactions</div>
            <div class="card-value">${recordsToExport.length}</div>
          </div>
        </div>
        
        <div class="section-title">Spending by Category</div>
        <div class="category-list">
          ${sortedCategories.map(([cat, val], idx) => `
            <div class="category-item">
              <div class="category-dot" style="background: ${[
                "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#22d3ee"
              ][idx % 7]}"></div>
              <span><strong>${cat}</strong>: ₹${val.toLocaleString("en-IN")}</span>
            </div>
          `).join("")}
        </div>
        
        <div class="section-title">Transactions Logs</div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Note / Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${recordsToExport.map(r => {
              const amt = parseFloat(r.amount);
              return `
                <tr>
                  <td>${new Date(r.Date).toLocaleDateString("en-IN")}</td>
                  <td style="font-weight: 500;">${r.category}</td>
                  <td style="color: #64748b;">${r.note || "—"}</td>
                  <td style="text-align: right;" class="amount ${amt < 0 ? 'credit' : 'expense'}">
                    ${amt < 0 ? "+" : ""}₹${Math.abs(amt).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>This report was generated securely by HisabKitab Personal Finance.</p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const today = new Date();
  const currentMonthIdx = today.getMonth();
  const currentYear = today.getFullYear();

  const currentMonthSpending = records.reduce((sum, record) => {
    const recordDateStr = record.Date.split("T")[0];
    const recordDate = new Date(recordDateStr);
    if (recordDate.getMonth() === currentMonthIdx && recordDate.getFullYear() === currentYear) {
      return sum + parseFloat(record.amount);
    }
    return sum;
  }, 0);

  const pct = budget > 0 ? (currentMonthSpending / budget) * 100 : 0;
  const colorClass = pct < 75 ? "bg-emerald-500" : pct <= 100 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="pb-8 md:pb-6">
      {/* Header: title + filters + view toggles */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center md:gap-4 mb-4">
        <h3 className="hidden md:block text-base md:text-lg font-bold px-2 md:py-4 text-slate-900 dark:text-white">
          {isSettings ? "App Preferences & Settings" : isDebts ? "Len-Den" : isSubscriptions ? "Bills & Subscriptions" : isGullak ? "Gullak (Savings Goals)" : isChart ? "Expense Charts" : "Expense Records"}
        </h3>

        {/* Filters (only show if not on subscriptions, debts, gullak, or settings panel) */}
        {!isSubscriptions && !isDebts && !isGullak && !isSettings && (
          <div className="p-3 md:p-4 flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-center bg-white dark:bg-[#1C1C1E] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm max-w-full">
            {!isChart ? (
              <select
                className="border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 rounded-lg p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#00C58D] transition w-full sm:w-auto cursor-pointer"
                style={{
                  backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
                  color: isDark ? "#FFFFFF" : "#0F172A",
                  borderColor: isDark ? "#3F3F46" : "#E2E8F0"
                }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option
                  value=""
                  style={{
                    backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
                    color: isDark ? "#FFFFFF" : "#0F172A"
                  }}
                >
                  All Categories
                </option>
                {[...new Set(records.map((d) => d.category))].map((category) => (
                  <option
                    key={category}
                    value={category}
                    style={{
                      backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
                      color: isDark ? "#FFFFFF" : "#0F172A"
                    }}
                  >
                    {category}
                  </option>
                ))}
              </select>
            ) : (
              <select
                className="border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 rounded-lg p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#00C58D] transition w-full sm:w-48 max-w-full cursor-pointer box-border"
                style={{
                  backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
                  color: isDark ? "#FFFFFF" : "#0F172A",
                  borderColor: isDark ? "#3F3F46" : "#E2E8F0"
                }}
                value={monthFilter}
                onChange={handleMonthDropdownChange}
              >
                <option
                  value=""
                  style={{
                    backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
                    color: isDark ? "#FFFFFF" : "#0F172A"
                  }}
                >
                  Select Month
                </option>
                {months.map((month, idx) => (
                  <option
                    key={idx}
                    value={idx + 1}
                    style={{
                      backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
                      color: isDark ? "#FFFFFF" : "#0F172A"
                    }}
                  >
                    {month}
                  </option>
                ))}
              </select>
            )}
            {!isChart && (
              <input
                type="date"
                className="border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 rounded-lg p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#00C58D] transition w-full sm:w-auto"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            )}
            {!isChart && (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleFilterRecords}
                  className="bg-[#00C58D] hover:bg-[#00b07e] text-white px-7 py-2 md:py-1.5 rounded-lg transition duration-200 cursor-pointer text-sm md:text-base w-full sm:w-auto font-semibold shadow-sm shadow-[#00C58D]/20 active:scale-95"
                >
                  Filter
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex items-center justify-center gap-1.5 border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 px-4 py-2 md:py-1.5 rounded-lg transition text-sm cursor-pointer font-semibold shadow-sm"
                  title="Export to CSV"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  CSV
                </button>
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="flex items-center justify-center gap-1.5 border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 px-4 py-2 md:py-1.5 rounded-lg transition text-sm cursor-pointer font-semibold shadow-sm"
                  title="Export to PDF"
                >
                  <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                  PDF
                </button>
              </div>
            )}
          </div>
        )}

        {/* View toggles - Cleanly visible on Desktop */}
        <div className="hidden md:flex items-center gap-4 px-2 md:px-0 pb-2 md:pb-0">
          <Users
            className={`w-6 h-6 cursor-pointer hover:text-indigo-500 transition ${isDebts ? "text-indigo-500 font-bold scale-110" : "text-slate-400 dark:text-zinc-500"}`}
            onClick={() => navigate("/app/debts")}
            title="Len-Den"
          />
          <CreditCard
            className={`w-6 h-6 cursor-pointer hover:text-blue-500 transition ${isSubscriptions ? "text-blue-500 font-bold scale-110" : "text-slate-400 dark:text-zinc-500"}`}
            onClick={() => navigate("/app/subscriptions")}
            title="Bills & Subscriptions"
          />
          <PiggyBank
            className={`w-6 h-6 cursor-pointer hover:text-amber-500 transition ${isGullak ? "text-amber-500 font-bold scale-110" : "text-slate-400 dark:text-zinc-500"}`}
            onClick={() => navigate("/app/gullak")}
            title="Gullak (Savings Goals)"
          />
          <FileSpreadsheet
            className={`w-6 h-6 cursor-pointer hover:text-[#00C58D] transition ${!isChart && !isSubscriptions && !isDebts && !isGullak && !isSettings ? "text-[#00C58D] font-bold scale-110" : "text-slate-400 dark:text-zinc-500"}`}
            onClick={() => navigate("/app/recordlist")}
            title="Expenses Records"
          />
          <ChartArea
            className={`w-6 h-6 cursor-pointer hover:text-rose-500 transition ${isChart ? "text-rose-500 font-bold scale-110" : "text-slate-400 dark:text-zinc-500"}`}
            onClick={() => navigate("/app")}
            title="Spending Charts"
          />
          <Settings2
            className={`w-6 h-6 cursor-pointer hover:text-slate-900 dark:hover:text-white transition ${isSettings ? "text-slate-900 dark:text-white font-bold scale-110" : "text-slate-400 dark:text-zinc-500"}`}
            onClick={() => navigate("/app/settings")}
            title="App Preferences & Settings"
          />
        </div>
      </div>

      {/* Monthly Budget Card (Shown only on Analytics screen) */}
      {isChart && (
        <div className="mb-6 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 dark:text-zinc-500 text-2xl">account_balance_wallet</span>
              <div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Monthly Budget Tracker</h4>
                <span className="text-xs text-slate-400 dark:text-zinc-500">Current Month: {months[currentMonthIdx]} {currentYear}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {editBudgetMode ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const amount = parseInt(budgetInput, 10);
                  if (isNaN(amount) || amount < 0) {
                    alert("Please enter a valid amount.");
                    return;
                  }
                  saveBudget(amount);
                  setBudget(amount);
                  setEditBudgetMode(false);
                }} className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Set Budget Limit"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00C58D] max-w-[120px]"
                  />
                  <button type="submit" className="p-1.5 bg-[#00C58D] hover:bg-[#00b07e] text-white rounded-lg transition cursor-pointer" title="Save">
                    <Check className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => { setEditBudgetMode(false); setBudgetInput(budget > 0 ? budget.toString() : ""); }} className="p-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 rounded-lg transition cursor-pointer" title="Cancel">
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      {budget > 0 ? `₹${currentMonthSpending.toLocaleString("en-IN")} of ₹${budget.toLocaleString("en-IN")}` : "No budget set"}
                    </span>
                    <span className={`text-xs font-semibold ${budget === 0 ? "text-slate-400 dark:text-zinc-500" : budget - currentMonthSpending >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {budget === 0 ? "Tap pencil to set limit" : budget - currentMonthSpending >= 0 ? `₹${(budget - currentMonthSpending).toLocaleString("en-IN")} remaining` : `₹${Math.abs(budget - currentMonthSpending).toLocaleString("en-IN")} over budget`}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditBudgetMode(true)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                    title="Edit Budget"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {budget > 0 && (
            <div className="w-full">
              <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                <span>0%</span>
                <span className="font-semibold text-slate-500 dark:text-zinc-400">{pct.toFixed(1)}% spent</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40 md:h-64 mt-20 md:mt-56">
          <Loader className="text-lg w-12 h-12 md:w-20 md:h-20 font-semibold animate-spin" />
        </div>
      ) : isSettings ? (
        <SettingsPanel />
      ) : isDebts ? (
        <DebtsPanel onRefresh={onRefresh} />
      ) : isSubscriptions ? (
        <SubscriptionsPanel
          records={records}
          onRefresh={onRefresh}
        />
      ) : isGullak ? (
        <GullakPanel
          records={records}
          onRefresh={onRefresh}
        />
      ) : isChart ? (
        <SpreadChart
          records={records}
          filteredRecordsChart={filteredRecordsChart}
          months={months}
        />
      ) : (
        <RecordList
          records={records}
          categoryFilter={categoryFilter}
          dateFilter={dateFilter}
          filteredRecords={filteredRecords}
          onDelete={onDelete}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};

export default Dashboard;
