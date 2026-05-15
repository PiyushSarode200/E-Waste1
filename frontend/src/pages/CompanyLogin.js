import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react';

const CompanyLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      alert('Please enter both email and password');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/company/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify({ ...data.user, userType: 'company' }));
      localStorage.setItem('token', data.token);
      navigate('/company/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}`);
    }
  };

  const createTestCompany = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/create-test-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      alert(`${data.message}\nEmail: ${data.email}\nPassword: ${data.password}`);
    } catch (error) {
      alert('Failed to create test company');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 to-primary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-eco-600 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Login</h1>
          <p className="text-gray-600">Sign in to your corporate account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
                  placeholder="Enter company email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-eco-600 text-white py-3 px-4 rounded-lg hover:bg-eco-700 transition-colors font-medium">
              Sign In as Company
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={createTestCompany}
              className="w-full flex items-center justify-center px-4 py-3 border border-eco-300 rounded-lg hover:bg-eco-50 transition-colors"
            >
              <span className="font-medium text-eco-700">Create Test Company</span>
            </button>
          </div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-600">
              Don't have a company account?{' '}
              <Link to="/company/signup" className="text-eco-600 hover:text-eco-700 font-medium">
                Register Company
              </Link>
            </p>
            <p className="text-gray-600">
              Are you an individual user?{' '}
              <Link to="/user/login" className="text-primary-600 hover:text-primary-700 font-medium">
                User Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;