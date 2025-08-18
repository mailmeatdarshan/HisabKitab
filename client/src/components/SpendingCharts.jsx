import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function SpendingCharts({records,filteredRecordsChart,months}) {
const monthlyData = months.map((month, idx) => {

  const total = records.reduce((sum, record) => {
    const dateString = record.Date;
    const date = dateString.split("T")[0];
    const monthIndex = new Date(date).getMonth();
    if (monthIndex === idx) {
      return sum + parseInt(record.amount);
    }
    return sum;
  }, 0);
  return { month, amount: total };
});
const categoryData = records.map((record) => {
  const {amount, category} = record;
 const newValues = {
  amount: parseInt(amount),
  category: category,
 }
 return newValues;
})
  const barData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Monthly Spending",
        data: monthlyData.map((d) => d.amount),
        backgroundColor: "#4b5513", 
      },
    ],
  };

  let pieData;
  if (!filteredRecordsChart || filteredRecordsChart.length === 0) {
    pieData = null;
  } else {
    const basePieColors = [
      "#ef4444", 
      "#f59e0b", 
      "#10b981", 
      "#3b82f6", 
      "#8b5cf6",
      "#ec4899",
      "#22d3ee",
      "#fbbf24",
      "#a3e635",
      "#6366f1",
      "#f87171",
      "#14b8a6"
    ];
    const pieColors = Array.from({ length: filteredRecordsChart.length }, (_, i) =>
      basePieColors[i % basePieColors.length]
    );
    pieData = {
      labels: filteredRecordsChart.map((d) => d._id),
      datasets: [
      {
        label: "Spending by Category",
        data: filteredRecordsChart.map((d) => d.total),
        backgroundColor: pieColors,
      },
      ],
    };
  }

  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 bg-white rounded-xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">📊 Monthly Spending</h2>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <Bar data={barData} options={{ maintainAspectRatio: false }} height={500} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">🥧 Spending by Category</h2>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            {pieData ? (
              <Pie data={pieData} options={{ maintainAspectRatio: false }} height={500} />
            ) : (
              <div className="text-gray-500 text-center py-20 mt-40">Select the month to see the Data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
