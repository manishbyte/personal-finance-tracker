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
import WealthOverview from "./WealthOverview";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TransactionChart = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false); 

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}api/user/get/transaction`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        console.log(data);
        
        setTransactionData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
        setLoading(false);
      }
    };

    fetchTransactions();

    setIsVisible(true);
  }, []);

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
    <div
      className={`flex flex-col md:flex-row justify-center items-center  mt-10 space-y-6 md:space-y-0 md:space-x-6 transition-opacity duration-1000 ease-out transform ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="w-full md:max-w-2xl flex-1 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
          Transaction Overview
        </h2>
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
        ) : transactionData.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">No transactions available</p>
        )}
      </div>
      <WealthOverview className="w-full md:ml-6" />
    </div>
  );
};

export default TransactionChart;
