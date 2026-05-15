import React, { useState } from 'react';
import CompanySidebar from './CompanySidebar';

const CompanyLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanySidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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

export default CompanyLayout;