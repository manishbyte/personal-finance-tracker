import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faLayerGroup, faListAlt, faBriefcase, faChartLine, faSignOutAlt, faSignInAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavigationBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };



  

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 bg-gray-800 text-white">
        <h1 className="text-sm font-bold">Personal Finance Tracker</h1>
      </div>

      <div className="flex flex-col mt-4 space-y-2 px-4">
        <Link to="/" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700">
          <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link to="/budget" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700">
          <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5" />
          <span>Budget</span>
        </Link>
        <Link to="/list" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700">
          <FontAwesomeIcon icon={faListAlt} className="w-5 h-5" />
          <span>History</span>
        </Link>
        <Link to="/form" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700">
          <FontAwesomeIcon icon={faBriefcase} className="w-5 h-5" />
          <span>Add Transaction</span>
        </Link>
        <Link to="/graph" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700">
          <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
          <span>Graph</span>
        </Link>
        <Link to="/edit-profile" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700">
          <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
          <span>Edit Profile</span>
        </Link>
      </div>

      <div className="mt-auto px-4 py-3">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-2 rounded w-full bg-gray-700 text-white hover:bg-gray-600"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
            <span>Logout</span>
          </button>
      </div>
    </div>
  );
};

export default NavigationBar;
