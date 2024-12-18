import React, { useEffect } from 'react';
import NavigationBar from './NavigationBar';
import ProfileCard from './ProfileCard';
import { Outlet } from 'react-router-dom';

const Layout = () => {

  
  return (
    <div className="flex min-h-screen">
      <div className="fixed z-20 inset-y-0 left-0 bg-gray-900 text-white w-64">
        <NavigationBar  />
      </div>

      <div className="flex-1 ml-64 p-4">
        <ProfileCard />

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
