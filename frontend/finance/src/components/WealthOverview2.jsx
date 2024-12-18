import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const WealthOverview2 = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (startDate && endDate) {
      const fetchTransactions = async () => {
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

          const aggregatedData = [];
          const transactionMap = new Map();

          data.forEach((transaction) => {
            if (transactionMap.has(transaction.description)) {
              transactionMap.set(
                transaction.description,
                transactionMap.get(transaction.description) + transaction.amount
              );
            } else {
              transactionMap.set(transaction.description, transaction.amount);
            }
          });

          transactionMap.forEach((amount, description) => {
            aggregatedData.push({ description, amount });
          });

          setTransactionData(aggregatedData);
          setTotalAmount(
            aggregatedData.reduce((sum, transaction) => sum + transaction.amount, 0)
          );
          setLoading(false);
        } catch (error) {
          console.error("Error fetching transactions:", error.message);
          setLoading(false);
        }
      };

      fetchTransactions();
    }
  }, [startDate, endDate]);

  const chartData = {
    labels: transactionData.map((transaction) => transaction.description || "Miscellaneous"),
    datasets: [
      {
        label: "Transaction Categories",
        data: transactionData.map((transaction) => transaction.amount),
        backgroundColor: ["#4caf50", "#ff9800", "#f44336", "#2196f3", "#9c27b0"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const category = tooltipItem.label;
            const value = tooltipItem.raw;
            return `${category}: ₹ ${value.toLocaleString()}`;
          },
        },
      },
    },
    cutout: "70%",
  };

  return (
    <div className="max-w-full sm:max-w-md mx-auto p-4 sm:p-6 bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center">Wealth Overview</h2>
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
      </div>
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : transactionData.length > 0 ? (
        <Doughnut data={chartData} options={chartOptions} />
      ) : (
        <p className="text-center text-gray-400">No transactions available</p>
      )}
    </div>
  );
};

export default WealthOverview2;
