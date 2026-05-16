import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserSidebar from './components/UserSidebar';
import CompanySidebar from './components/CompanySidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Features from './pages/Features';
import Rewards from './pages/Rewards';
import Partnerships from './pages/Partnerships';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import UserLogin from './pages/UserLogin';
import CompanyLogin from './pages/CompanyLogin';
import LoginChoice from './pages/LoginChoice';
import UserSignup from './pages/UserSignup';
import CompanySignup from './pages/CompanySignup';
import SignupChoice from './pages/SignupChoice';
import UserDashboard from './pages/UserDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import QRScanPage from './pages/QRScanPage';
import CompanyReports from './pages/CompanyReports';
import CompanyTransactions from './pages/CompanyTransactions';
import CompanyMarketplace from './pages/CompanyMarketplace';
import RewardsWallet from './pages/RewardsWallet';
import ImpactDashboard from './pages/ImpactDashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import SubmitDevice from './pages/SubmitDevice';
import UserDevices from './pages/UserDevices';
import UserMarketplace from './pages/UserMarketplace';

const AppContent = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('user');
  const userType = user.userType;
  
  const isAuthPage = ['/login', '/user/login', '/company/login', '/signup', '/user/signup', '/company/signup'].includes(location.pathname);
  const isPublicPage = ['/', '/about', '/how-it-works', '/partnerships'].includes(location.pathname);
  const isUserRoute = location.pathname.startsWith('/user/');
  const isCompanyRoute = location.pathname.startsWith('/company/');
  
  const showNavbar = isPublicPage || (!isLoggedIn && isAuthPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/signup" element={<SignupChoice />} />
            <Route path="/user/signup" element={<UserSignup />} />
            <Route path="/company/signup" element={<CompanySignup />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginChoice />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/company/login" element={<CompanyLogin />} />
            
            {/* User Routes */}
            <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/user/qr-scan" element={<ProtectedRoute><QRScanPage /></ProtectedRoute>} />
            <Route path="/user/submit-device" element={<ProtectedRoute><SubmitDevice /></ProtectedRoute>} />
            <Route path="/user/devices" element={<ProtectedRoute><UserDevices /></ProtectedRoute>} />
            <Route path="/user/rewards-wallet" element={<ProtectedRoute><RewardsWallet /></ProtectedRoute>} />
            <Route path="/user/impact-dashboard" element={<ProtectedRoute><ImpactDashboard /></ProtectedRoute>} />
            <Route path="/user/features" element={<ProtectedRoute><Features /></ProtectedRoute>} />
            <Route path="/user/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
            <Route path="/user/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
            <Route path="/user/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path="/user/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/user/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/user/marketplace" element={<ProtectedRoute><UserMarketplace /></ProtectedRoute>} />
            
            {/* Company Routes */}
            <Route path="/company/dashboard" element={<ProtectedRoute><CompanyDashboard /></ProtectedRoute>} />
            <Route path="/company/transactions" element={<ProtectedRoute><CompanyTransactions /></ProtectedRoute>} />
            <Route path="/company/reports" element={<ProtectedRoute><CompanyReports /></ProtectedRoute>} />
            <Route path="/company/marketplace" element={<ProtectedRoute><CompanyMarketplace /></ProtectedRoute>} />
            <Route path="/company/partnerships" element={<ProtectedRoute><Partnerships /></ProtectedRoute>} />
            <Route path="/company/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path="/company/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
    </div>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;