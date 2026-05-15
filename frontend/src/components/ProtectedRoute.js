import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  const location = useLocation();
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  
  const user = JSON.parse(userStr);
  
  // Protect Company Routes
  if (location.pathname.startsWith('/company') && user.userType !== 'company') {
    return <Navigate to="/user/dashboard" replace />;
  }
  
  // Protect User Routes
  if (location.pathname.startsWith('/user') && user.userType === 'company') {
    return <Navigate to="/company/dashboard" replace />;
  }
  
  return children;
};

export default ProtectedRoute;