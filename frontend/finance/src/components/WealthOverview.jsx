import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const WealthOverview = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

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

        const total = aggregatedData.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );

        setTotalAmount(total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const chartData = {
    labels: transactionData.map((transaction) => transaction.description || "Miscellaneous"),
    datasets: [
      {
        label: "Transaction Categories",
        data: transactionData.map((transaction) => transaction.amount),
        backgroundColor: [
          "#4caf50",
          "#ff9800",
          "#f44336",
          "#2196f3",
          "#9c27b0",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, 
      },
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

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw(chart) {
      const { width } = chart;
      const { ctx } = chart;
      ctx.save();

      ctx.font = "bold 20px Arial";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(`₹ ${totalAmount.toLocaleString()}`, width / 2, width / 2 - 10);

      ctx.font = "16px Arial";
      ctx.fillStyle = "#aaa";
      ctx.fillText("Total Spend", width / 2, width / 2 + 20);

      ctx.restore();
    },
  };

  return (
    <div className="max-w-md  mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        Wealth Overview
      </h2>
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : transactionData.length > 0 ? (
        <div>
          <Doughnut data={chartData} options={chartOptions} plugins={[centerTextPlugin]} />
        </div>
      ) : (
        <p className="text-center text-gray-400">No transactions available</p>
      )}
    </div>
  );
};

export default WealthOverview;
