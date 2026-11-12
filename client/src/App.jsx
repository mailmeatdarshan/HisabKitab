import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "./utils/data-access";
import { Loader } from "lucide-react";
import { 
  isUserAuthenticated, 
  getGuestRecords, 
  clearGuestRecords 
} from "./utils/local-storage-helper";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "./context/SettingsContext";

const App = () => {
  const { theme } = useSettings();
  const isDark = theme === 'dark';
  const [records, setRecords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [guestCount, setGuestCount] = useState(0);

  const onClose = () => {
    setIsOpen(!isOpen);
  };
  const onCloseSummary = () => {
    setIsSummaryOpen(!isSummaryOpen);
  };

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    if (isUserAuthenticated()) {
      try {
        const res = await axiosInstance.get("/expanses");
        const responseData = res.data;
        const data = responseData.data;
        setRecords(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      const data = getGuestRecords();
      setRecords(data);
      setLoading(false);
    }
  }, []);

  const handleDelete = (id) => {
    setRecords((prev) => prev.filter((r) => r._id !== id));
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const guestRecords = getGuestRecords();
      for (const record of guestRecords) {
        const payload = {
          amount: record.amount,
          category: record.category,
          Date: record.Date.split("T")[0],
          note: record.note,
        };
        await axiosInstance.post("/expanses", payload);
      }
      clearGuestRecords();
      alert(`Successfully synced ${guestRecords.length} records to your account!`);
      fetchRecords();
    } catch (error) {
      console.error("Failed to sync records", error);
      alert("An error occurred during synchronization. Please try again.");
    } finally {
      setSyncing(false);
      setShowSyncModal(false);
    }
  };

  const handleDiscardSync = () => {
    if (window.confirm("Are you sure you want to discard your local guest records? They will be permanently deleted.")) {
      clearGuestRecords();
      setShowSyncModal(false);
      fetchRecords();
    }
  };

  useEffect(() => {
    fetchRecords();
    if (isUserAuthenticated()) {
      const guestRecords = getGuestRecords();
      if (guestRecords.length > 0) {
        setGuestCount(guestRecords.length);
        setShowSyncModal(true);
      }
    }
  }, [fetchRecords]);

  return (
    <div
      className="w-full min-h-screen p-3 md:p-6 transition-colors duration-200"
      style={{
        backgroundColor: isDark ? '#121214' : '#F8FAFC',
        color: isDark ? '#F4F4F5' : '#0F172A'
      }}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onOpenAddRecord={() => setIsOpen(true)}
        onOpenSendSummary={() => setIsSummaryOpen(true)}
      />

      <Navbar
        loading={loading}
        isOpen={isOpen}
        onClose={onClose}
        setIsOpen={setIsOpen}
        isSummaryOpen={isSummaryOpen}
        setIsSummaryOpen={setIsSummaryOpen}
        onCloseSummary={onCloseSummary}
        fetchRecords={fetchRecords}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      {loading ? (
        <div className="flex justify-center items-center h-64 mt-56">
          <Loader className="text-lg w-20 h-20 font-semibold animate-spin text-[#00C58D]" />
        </div>
      ) : (
        <Dashboard records={records} onDelete={handleDelete} onRefresh={fetchRecords} />
      )}

      <AnimatePresence>
        {showSyncModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-zinc-800 flex flex-col gap-6"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-[#00C58D] mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sync Unsaved Expenses</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  We found <span className="font-semibold text-slate-900 dark:text-zinc-100">{guestCount}</span> expense records created in guest mode. 
                  Would you like to sync them with your account?
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={handleDiscardSync}
                  disabled={syncing}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition disabled:opacity-50 cursor-pointer"
                >
                  Discard Local
                </button>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#00C58D] hover:bg-[#00b07e] text-white text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-[#00C58D]/25 cursor-pointer"
                >
                  {syncing ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    "Sync to Account"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
