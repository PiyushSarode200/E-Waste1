import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Building2, 
  BarChart3, 
  Zap, 
  Gift, 
  Users, 
  BookOpen, 
  Phone,
  User,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'rewards-wallet', label: 'Rewards Wallet', icon: Wallet, path: '/rewards-wallet' },
    { id: 'company-resale', label: 'Company Resale', icon: Building2, path: '/company-resale' },
    { id: 'impact-dashboard', label: 'Impact Dashboard', icon: BarChart3, path: '/impact-dashboard' },
    { id: 'features', label: 'Features', icon: Zap, path: '/features' },
    { id: 'rewards', label: 'Rewards', icon: Gift, path: '/rewards' },
    { id: 'partnerships', label: 'Partners', icon: Users, path: '/partnerships' },
    { id: 'blog', label: 'Blog', icon: BookOpen, path: '/blog' },
    { id: 'contact', label: 'Contact', icon: Phone, path: '/contact' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200 z-40">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">E-Waste Loop</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-6">
        <Link to="/profile" className="flex items-center mb-4 hover:bg-gray-50 p-2 rounded-md transition-colors">
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
  );
};

export default Sidebar;