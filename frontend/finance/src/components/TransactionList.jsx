import React, { useEffect, useState } from "react";
import { useFinance } from "../context/FinanceContext"; 
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrash, 
  faEdit, 
  faSave, 
  faTimes, 
  faCalendar, 
  faFileAlt, 
  faDollarSign 
} from '@fortawesome/free-solid-svg-icons';
import DateFilter from "./DateFilter";

const TransactionList = () => {
  const { state, fetchTransactions, deleteTransactionFromState, updateTransactionInState } = useFinance();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState({ date: "", description: "", amount: "" });
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${editingTransaction._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      const updatedTransaction = await response.json();
      updateTransactionInState(updatedTransaction); 
      setEditingTransaction(null);
      setEditForm({ date: "", description: "", amount: "" });
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      deleteTransactionFromState(id); 
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleDateFilter = async (startDate, endDate) => {
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

      if (!response) {
        throw new Error("Failed to fetch transactions");
      }

      const filteredTransactions = await response.json();
      setFilteredTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const transactionsToRender = filteredTransactions.length > 0 ? filteredTransactions : state.transactions;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-gray-900 text-white"
    >
      <motion.h2 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center"
      >
        <FontAwesomeIcon icon={faFileAlt} className="mr-3" />
        Transaction List
      </motion.h2>

      <div className="mb-6">
        <DateFilter onFilter={handleDateFilter} />
      </div>

      <div className="bg-gray-800 shadow-lg dark:shadow-xl rounded-xl overflow-hidden">
        <AnimatePresence>
          {transactionsToRender.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-white">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      <FontAwesomeIcon icon={faCalendar} className="inline-block mr-2 -mt-1" />
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      <FontAwesomeIcon icon={faFileAlt} className="inline-block mr-2 -mt-1" />
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <span className="inline-block mr-2 -mt-1">₹</span>
                    Amount
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {transactionsToRender.map((transaction) => (
                    <motion.tr
                      key={transaction._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="hover:bg-gray-700 transition-colors"
                    >
                      {editingTransaction?._id === transaction._id ? (
                        <td colSpan={4} className="p-4">
                          <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4"
                          >
                            <input
                              type="date"
                              name="date"
                              value={editForm.date}
                              onChange={handleFormChange}
                              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                            <input
                              type="text"
                              name="description"
                              value={editForm.description}
                              onChange={handleFormChange}
                              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                              placeholder="Description"
                            />
                            <input
                              type="number"
                              name="amount"
                              value={editForm.amount}
                              onChange={handleFormChange}
                              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                              placeholder="Amount"
                            />
                            <div className="flex space-x-2 justify-center">
                              <button
                                onClick={handleSaveEdit}
                                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors flex items-center"
                              >
                                <FontAwesomeIcon icon={faSave} className="mr-2" /> Save
                              </button>
                              <button
                                onClick={() => setEditingTransaction(null)}
                                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors flex items-center"
                              >
                                <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancel
                              </button>
                            </div>
                          </motion.div>
                        </td>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {transaction.description}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                          ₹{transaction.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => {
                                  setEditingTransaction(transaction);
                                  setEditForm({
                                    date: new Date(transaction.date).toISOString().split("T")[0],
                                    description: transaction.description,
                                    amount: transaction.amount,
                                  });
                                }}
                                className="text-blue-500 hover:text-blue-600 transition-colors"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                onClick={() => handleDelete(transaction._id)}
                                className="text-red-500 hover:text-red-600 transition-colors"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 text-gray-500"
            >
              No transactions available
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TransactionList;
