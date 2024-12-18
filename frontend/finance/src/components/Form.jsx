import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { motion } from "framer-motion";

const Form = () => {
  const { addTransaction } = useFinance();
  const [formData, setFormData] = useState({ description: "", amount: "", date: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addTransaction(formData);
      setFormData({ description: "", amount: "", date: "" });
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl sm:max-w-5xl md:max-w-7xl lg:max-w-8xl mx-auto px-4 sm:px-6 md:px-8 py-6"
    >
      <form 
        onSubmit={handleSubmit} 
        className="
          w-full
          bg-white dark:bg-gray-800 
          shadow-lg dark:shadow-xl 
          rounded-xl 
          p-8 md:p-12
          space-y-6
          border 
          border-gray-200 
          dark:border-gray-700
          transition-all 
          duration-300 
          ease-in-out
        "
      >
        <motion.div 
          whileFocus={{ scale: 1.02 }}
          className="mb-5"
        >
          <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="
              w-full 
              p-4 
              text-base
              border 
              rounded-lg 
              focus:ring-2 
              focus:ring-blue-500 
              dark:bg-gray-700 
              dark:text-white 
              dark:border-gray-600
              transition-all 
              duration-300
            "
            required
            placeholder="Enter transaction description"
          />
        </motion.div>

        <motion.div 
          whileFocus={{ scale: 1.02 }}
          className="mb-5"
        >
          <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="
              w-full 
              p-4 
              text-base
              border 
              rounded-lg 
              focus:ring-2 
              focus:ring-blue-500 
              dark:bg-gray-700 
              dark:text-white 
              dark:border-gray-600
              transition-all 
              duration-300
            "
            required
            placeholder="Enter amount"
            step="0.01"
          />
        </motion.div>

        <motion.div 
          whileFocus={{ scale: 1.02 }}
          className="mb-5"
        >
          <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="
              w-full 
              p-4 
              text-base
              border 
              rounded-lg 
              focus:ring-2 
              focus:ring-blue-500 
              dark:bg-gray-700 
              dark:text-white 
              dark:border-gray-600
              transition-all 
              duration-300
            "
            required
          />
        </motion.div>

        <motion.button 
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            w-full 
            px-7 
            py-4 
            text-base
            bg-blue-500 
            hover:bg-blue-600 
            text-white 
            rounded-lg 
            font-semibold 
            transition-all 
            duration-300 
            ease-in-out
            dark:bg-blue-600 
            dark:hover:bg-blue-700
            flex 
            items-center 
            justify-center 
            space-x-2
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? (
            <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
          ) : (
            "Add Transaction"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Form;
