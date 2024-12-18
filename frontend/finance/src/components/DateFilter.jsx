import React, { useState } from "react";

const DateFilter = ({ onFilter }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = () => {
    if (startDate && endDate) {
      onFilter(startDate, endDate);
    } else {
      alert("Please select both start and end dates.");
    }
  };

  return (
    <div className="mb-4 flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-white">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>
      <button
        onClick={handleFilter}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Filter
      </button>
    </div>
  );
};

export default DateFilter;
