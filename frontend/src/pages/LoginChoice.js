import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Building2, Recycle } from 'lucide-react';

const LoginChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-eco-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Recycle className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to E-Waste Loop</h1>
          <p className="text-xl text-gray-600">Choose your account type to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Login */}
          <div className="group cursor-pointer" onClick={() => navigate('/user/login')}>
            <div className="card hover:shadow-xl transition-all duration-300 group-hover:scale-105 text-center p-8">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Individual User</h2>
              <p className="text-gray-600 mb-6">
                Recycle your personal electronic devices, track your environmental impact, and earn rewards for sustainable choices.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  QR Code Scanner for device tracking
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  Personal rewards wallet
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  Environmental impact dashboard
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  Access to learning resources
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div>
                  <span className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium group-hover:bg-primary-700 transition-colors">
                    Login as User
                  </span>
                </div>
                <div className="text-sm">
                  <Link to="/user/signup" className="text-primary-600 hover:text-primary-700 font-medium" onClick={(e) => e.stopPropagation()}>
                    or Sign up as User
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Company Login */}
          <div className="group cursor-pointer" onClick={() => navigate('/company/login')}>
            <div className="card hover:shadow-xl transition-all duration-300 group-hover:scale-105 text-center p-8">
              <div className="bg-eco-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-eco-200 transition-colors">
                <Building2 className="h-10 w-10 text-eco-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Company</h2>
              <p className="text-gray-600 mb-6">
                Manage corporate e-waste programs, access detailed analytics, and participate in the circular economy marketplace.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-eco-600 rounded-full mr-3"></div>
                  Comprehensive reporting dashboard
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-eco-600 rounded-full mr-3"></div>
                  B2B marketplace access
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-eco-600 rounded-full mr-3"></div>
                  Partnership management tools
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-eco-600 rounded-full mr-3"></div>
                  Compliance tracking
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div>
                  <span className="bg-eco-600 text-white px-6 py-3 rounded-lg font-medium group-hover:bg-eco-700 transition-colors">
                    Login as Company
                  </span>
                </div>
                <div className="text-sm">
                  <Link to="/company/signup" className="text-eco-600 hover:text-eco-700 font-medium" onClick={(e) => e.stopPropagation()}>
                    or Sign up as Company
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginChoice;