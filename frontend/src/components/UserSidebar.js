import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  QrCode,
  Wallet, 
  BarChart3, 
  Zap, 
  Gift, 
  BookOpen, 
  Phone,
  User,
  LogOut,
  Recycle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';

const UserSidebar = ({ isOpen = true, onToggle }) => {
  const location = useLocation();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/user/dashboard' },
    { id: 'qr-scan', label: 'QR Scanner', icon: QrCode, path: '/user/qr-scan' },
    { id: 'rewards-wallet', label: 'Rewards Wallet', icon: Wallet, path: '/user/rewards-wallet' },
    { id: 'impact-dashboard', label: 'Impact Dashboard', icon: BarChart3, path: '/user/impact-dashboard' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart, path: '/user/marketplace' },
    { id: 'features', label: 'Features', icon: Zap, path: '/user/features' },
    { id: 'rewards', label: 'Rewards', icon: Gift, path: '/user/rewards' },
    { id: 'blog', label: 'Blog', icon: BookOpen, path: '/user/blog' },
    { id: 'contact', label: 'Contact', icon: Phone, path: '/user/contact' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/user/login';
  };

  return (
    <>
      {/* Header with Toggle */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-xl font-semibold text-gray-900">E-Waste Loop</h1>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-64'
      }`}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-primary-600 to-eco-600 p-2 rounded-lg">
              <Recycle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-eco-600 bg-clip-text text-transparent">User Portal</h2>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
        </div>
      
        <nav className="mt-6 overflow-y-auto flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-r-lg mr-2 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-r-4 border-primary-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          );
        })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-100">
        <Link to="/user/profile" className="flex items-center mb-4 hover:bg-gradient-to-r hover:from-primary-50 hover:to-eco-50 p-3 rounded-lg transition-all duration-200 hover:scale-105">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{JSON.parse(localStorage.getItem('user') || '{}').name || 'User'}</p>
            <p className="text-xs text-gray-500">{JSON.parse(localStorage.getItem('user') || '{}').email || 'user@example.com'}</p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </button>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;