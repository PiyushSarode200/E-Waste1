import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

const Header = ({ onToggleSidebar, title = "Dashboard" }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Search className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;