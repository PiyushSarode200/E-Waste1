import React, { useState } from 'react';
import UserSidebar from './UserSidebar';

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <UserSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`transition-all duration-300 pt-16 ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserLayout;