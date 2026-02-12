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

export default function SpendingCharts({ records, filteredRecordsChart, months }) {
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
    const { amount, category } = record;
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 p-3 md:p-6 bg-white rounded-xl shadow-xl">
        <div>
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-800">📊 Monthly Spending</h2>
          <div className="w-full">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    labels: {
                      font: { size: window.innerWidth < 768 ? 10 : 12 }
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      font: { size: window.innerWidth < 768 ? 9 : 12 }
                    }
                  },
                  y: {
                    ticks: {
                      font: { size: window.innerWidth < 768 ? 9 : 12 }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-800">🥧 Spending by Category</h2>
          <div className="w-full flex justify-center">
            {pieData ? (
              <div className="w-full max-w-[300px] md:max-w-[400px]">
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: window.innerWidth < 768 ? 'bottom' : 'right',
                        labels: {
                          font: { size: window.innerWidth < 768 ? 10 : 12 },
                          boxWidth: window.innerWidth < 768 ? 12 : 40
                        }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="text-gray-500 text-center py-10 md:py-20 mt-10 md:mt-40">Select the month to see the Data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
