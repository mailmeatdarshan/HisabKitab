import { ChartArea, FileSpreadsheet, Loader } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import RecordList from "./RecordList";
import SpreadChart from "../components/SpendingCharts";
import { useState } from "react";
import axiosInstance from "../utils/data-access";
import { isUserAuthenticated, filterGuestRecords, getGuestSummary } from "../utils/local-storage-helper";

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
  const isChart = location.pathname === "/app";

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
      if (selectedMonthIdx === "" || selectedMonthIdx === undefined) {
        alert("Please select month to filter");
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
    const selectedMonthIdx = parseInt(e.target.value, 10) - 1;
    setMonthFilter(e.target.value);
    await handleFilterRecordsChart(selectedMonthIdx);
  };

  return (
    <div>
      {/* Header: title + filters + view toggles */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center md:gap-4 pr-0 md:pr-6">
        <h3 className="text-base md:text-lg font-semibold px-2 md:p-4">
          {isChart ? "Expanses Charts" : "Expanses Records"}
        </h3>

        {/* Filters */}
        <div className="p-3 md:p-4 flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-center bg-gray-50 rounded-lg shadow mb-2 md:mb-4">
          {!isChart ? (
            <select
              className="border border-gray-300 rounded p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-slate-900 transition w-full sm:w-auto"
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
              className="border border-gray-300 rounded p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-auto"
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
              className="border border-gray-300 rounded p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-auto"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          )}
          {!isChart && (
            <button
              type="button"
              onClick={handleFilterRecords}
              className="border border-black bg-black px-7 py-2 md:py-1.5 rounded hover:bg-white hover:text-black transition duration-300 ease-in-out text-white cursor-pointer text-sm md:text-base w-full sm:w-auto"
            >
              Filter
            </button>
          )}
        </div>

        {/* View toggles */}
        <div className="flex gap-4 px-2 md:px-0 pb-2 md:pb-0">
          <FileSpreadsheet
            className="w-7 h-7 md:w-8 md:h-8 cursor-pointer hover:text-green-500"
            onClick={() => navigate("/app/recordlist")}
          />
          <ChartArea
            className="w-7 h-7 md:w-8 md:h-8 cursor-pointer hover:text-red-500"
            onClick={() => navigate("/app")}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 md:h-64 mt-20 md:mt-56">
          <Loader className="text-lg w-12 h-12 md:w-20 md:h-20 font-semibold animate-spin" />
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
