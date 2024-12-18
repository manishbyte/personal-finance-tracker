import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; 
import Signup from './components/Signup';
import Login from './components/Login';
import SetBudget from './components/SetBudget';
import TransactionChart from './components/TransactionChart';
import Form from './components/Form';
import Graph from './components/Graph';
import TransactionList from './components/TransactionList';
import EditProfile from './components/EditProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/" element={<TransactionChart />} />
          <Route path="/budget" element={<SetBudget />} />
          <Route path="/form" element={<Form />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/list" element={<TransactionList />} />
          <Route path="/edit-profile" element={<EditProfile/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
