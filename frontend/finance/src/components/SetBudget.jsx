import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDollarSign, 
  faCalendarAlt, 
  faCircleCheck, 
  faCircleExclamation 
} from "@fortawesome/free-solid-svg-icons";
import CheckBudget from "./CheckBudget";

const SetBudget = () => {
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}api/user/set-budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount, startDate, endDate }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setError("");
        setAmount("");
        setStartDate("");
        setEndDate("");
      } else {
        setError(data.error || "Something went wrong.");
        setMessage("");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white flex items-center justify-center gap-3">
                <FontAwesomeIcon 
                  icon={faDollarSign} 
                  className="text-blue-400 text-2xl md:text-3xl"
                />
                Set Your Budget
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="amount" className="block font-medium text-gray-300">
                    Budget Amount (₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="startDate" className="block font-medium text-gray-300">
                    Start Date
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="endDate" className="block font-medium text-gray-300">
                    End Date
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="date"
                      id="endDate"
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
                  Set Budget
                </button>
              </form>

              {error && (
                <div className="mt-6 flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-lg">
                  <FontAwesomeIcon icon={faCircleExclamation} className="text-lg" />
                  <p>{error}</p>
                </div>
              )}
              
              {message && (
                <div className="mt-6 flex items-center gap-2 text-emerald-400 bg-emerald-400/10 p-4 rounded-lg">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-lg" />
                  <p>{message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            <CheckBudget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetBudget;