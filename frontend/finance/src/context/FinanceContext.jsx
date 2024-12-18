import React, { createContext, useReducer, useContext } from "react";

const initialState = {
  transactions: [], 
  budget: 0,         
 
};

const financeReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions], 
      };
    case "SET_BUDGET":
      return {
        ...state,
        budget: action.payload, 
      };
    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload, 
      };
    case "UPDATE_TOTAL_AMOUNT_SPENT":
      return {
        ...state,
        totalAmountSpent: action.payload, 
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  const addTransaction = async (transaction) => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}api/user/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(transaction),
      });

      if (!response.ok) throw new Error("Failed to add transaction");
      const data = await response.json();

      dispatch({ type: "ADD_TRANSACTION", payload: data }); 
    } catch (error) {
      console.error("Error adding transaction:", error.message);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}api/user/get/transaction`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
      });

      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();

      dispatch({ type: "SET_TRANSACTIONS", payload: data }); 

      
      
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
    }
  };





  return (
    <FinanceContext.Provider
      value={{
        state,
        dispatch,
        addTransaction,
        fetchTransactions,
       
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
