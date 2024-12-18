import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarAlt, 
  faCircleCheck, 
  faCircleExclamation,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";

const CheckBudget = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [totalSpent, setTotalSpent] = useState(0);
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [error, setError] = useState("");

  const handleCheckBudget = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}api/user/check-budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ startDate, endDate }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTotalSpent(data.totalSpent);
        setBudgetAmount(data.budget);
        setError("");
      } else {
        setError(data.error || "Something went wrong.");
        setMessage("");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      setMessage("");
    }
  };

  const getProgressColor = () => {
    const percentage = (totalSpent / budgetAmount) * 100;
    if (percentage <= 50) return 'bg-emerald-500';
    if (percentage <= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white flex items-center justify-center gap-3">
          <FontAwesomeIcon 
            icon={faChartLine} 
            className="text-blue-400 text-2xl md:text-3xl"
          />
          Check Your Budget
        </h2>
        
        <form onSubmit={handleCheckBudget} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="checkStartDate" className="block font-medium text-gray-300">
              Start Date
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="date"
                id="checkStartDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="checkEndDate" className="block font-medium text-gray-300">
              End Date
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="date"
                id="checkEndDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-8"
          >
            Check Budget
          </button>
        </form>

        {error && (
          <div className="mt-6 flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-lg">
            <FontAwesomeIcon icon={faCircleExclamation} className="text-lg" />
            <p>{error}</p>
          </div>
        )}

        {message && (
          <div className="mt-6 space-y-4">
            <div className={`flex items-center gap-2 ${totalSpent <= budgetAmount ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'} p-4 rounded-lg`}>
              <FontAwesomeIcon icon={totalSpent <= budgetAmount ? faCircleCheck : faCircleExclamation} className="text-lg" />
              <p className="font-bold">{message}</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-gray-300">
                  <span>Total Spent:</span>
                  <span className="font-bold text-white">₹{totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Budget Amount:</span>
                  <span className="font-bold text-white">₹{budgetAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-300">Budget Usage</div>
                <div className="w-full bg-gray-600 rounded-full h-4">
                  <div
                    className={`${getProgressColor()} h-4 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${Math.min((totalSpent / budgetAmount) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-300">
                  {budgetAmount > 0 ? `${Math.round((totalSpent / budgetAmount) * 100)}%` : '0%'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckBudget;