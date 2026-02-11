import { ChartArea, FileSpreadsheet, Loader } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import RecordList from "./RecordList";
import SpreadChart from "../components/SpendingCharts";
import { useState } from "react";
import axiosInstance from "../utils/data-access";

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
  const [monthFilter, setMonthFilter] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filteredRecordsChart, setFilteredRecordsChart] = useState([]);
  const [dateFilterChart, setDateFilterChart] = useState("");
  const [loading, setLoading] = useState(false);
  const isChart = location.pathname === "/";

  const handleFilterRecords = async () => {
    try {
      setLoading(true);
      if (!categoryFilter && !dateFilter) {
        setFilteredRecords(records);
        setLoading(false);
        return;
      }
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterRecordsChart = async (selectedMonthIdx) => {
    try {
      setLoading(true);
      if (selectedMonthIdx === "" || selectedMonthIdx === undefined) {
        alert("Please select month to filter");
        setLoading(false);
        return;
      }
      const month = String(selectedMonthIdx + 1).padStart(2, "0");
      const year = new Date().getFullYear();
      const selectedDate = `${year}-${month}-01`;
      setDateFilterChart(selectedDate);

      const response = await axiosInstance.get(
        `/expanses/summary?Date=${selectedDate}`
      );
      const responseData = response.data;
      setFilteredRecordsChart(responseData.data || []);
    } catch (error) {
      console.error(error);
      setDateFilterChart("");
      setFilteredRecordsChart([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthDropdownChange = async (e) => {
    const selectedMonthIdx = parseInt(e.target.value, 10) - 1;
    setMonthFilter(e.target.value);
    await handleFilterRecordsChart(selectedMonthIdx);
  };

  return (
    <div>
      <div className="flex w-full justify-between items-center gap-4 pr-6">
        <h3 className="text-lg font-semibold p-4">
          {isChart ? "Expanses Charts" : "Expanses Records"}
        </h3>
        <div className="p-4 flex flex-col md:flex-row gap-4 items-center bg-gray-50 rounded-lg shadow mb-4">
          {!isChart ? (
            <select
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {[...new Set(records.map((d) => d.category))].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          ) : (
            <select
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={monthFilter}
              onChange={handleMonthDropdownChange}
            >
              <option value="">Select Month</option>
              {months.map((month, idx) => (
                <option key={idx} value={idx + 1}>
                  {month}
                </option>
              ))}
            </select>
          )}
          {!isChart && (
            <input
              type="date"
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          )}
          {!isChart && (
            <button
              type="button"
              onClick={handleFilterRecords}
              className="border border-black bg-black  px-7 py-1.5 rounded hover:bg-white hover:text-black transition duration-300 ease-in-out text-white  cursor-pointer"
            >
              Filter
            </button>
          )}
        </div>
        <div className="flex gap-4">
          <FileSpreadsheet
            className="w-8 h-8 cursor-pointer hover:text-green-500"
            onClick={() => navigate("/recordlist")}
          />
          <ChartArea
            className="w-8 h-8 cursor-pointer hover:text-red-500"
            onClick={() => navigate("/")}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64 mt-56">
          <Loader className="text-lg w-20 h-20 font-semibold animate-spin" />
        </div>
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
