import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "./utils/data-access";
import { Loader } from "lucide-react";

const App = () => {
  const [records, setRecords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const onClose = () => {
    setIsOpen(!isOpen);
  };
const onCloseSummary = () => {
  setIsSummaryOpen(!isSummaryOpen);
}
  const fetchRecords = useCallback(async () => {
    setLoading(true);
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
  }, []);


  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div className="w-full p-6">
      <Navbar loading={loading} isOpen={isOpen} onClose={onClose} setIsOpen={setIsOpen} isSummaryOpen={isSummaryOpen} setIsSummaryOpen={setIsSummaryOpen} onCloseSummary={onCloseSummary} />
      {loading ? (
        <div className="flex justify-center items-center h-64 mt-56">
            <Loader className="text-lg w-20 h-20 font-semibold animate-spin" />
        </div>
      ) : (
        <Dashboard  records={records} />
      )}
    </div>
  );
};

export default App;
