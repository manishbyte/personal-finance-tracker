import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import WealthOverview2 from "./WealthOverview2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graph = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTransactions = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_BACKEND_URL}api/user/date/transaction?start=${startDate}&end=${endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      console.log(data);

      setTransactionData(data);
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: transactionData.map((transaction) =>
      new Date(transaction.date).toLocaleDateString("en-GB")
    ),
    datasets: [
      {
        label: "Transaction Amount (₹)",
        data: transactionData.map((transaction) => transaction.amount),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Transaction Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount (₹)",
        },
      },
    },
  };

  return (
    <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0 justify-center items-center mt-6 p-4">
      <div className="w-full max-w-3xl p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white text-center mb-4">
          Transaction Overview
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4 space-y-4 sm:space-y-0">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-2 dark:bg-gray-700 dark:text-white w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-2 dark:bg-gray-700 dark:text-white w-full"
            />
          </div>
          <button
            onClick={fetchTransactions}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded dark:bg-blue-600"
          >
            Fetch
          </button>
        </div>
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        ) : transactionData.length > 0 ? (
          <div className="relative h-64 sm:h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No transactions available
          </p>
        )}
      </div>

      <WealthOverview2 className="w-full max-w-xl" />
    </div>
  );
};

export default Graph;
