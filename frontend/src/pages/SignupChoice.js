import React from 'react';
import { Link } from 'react-router-dom';
import { User, Building2, Recycle } from 'lucide-react';

const SignupChoice = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-eco-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Recycle className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join E-Waste Loop</h1>
          <p className="text-xl text-gray-600">Choose your account type to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/user/signup" className="group">
            <div className="card hover:shadow-xl transition-all duration-300 group-hover:scale-105 text-center p-8">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Individual User</h2>
              <p className="text-gray-600 mb-6">
                Create a personal account to recycle your electronic devices and earn rewards.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  Track personal device recycling
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  Earn eco-points and rewards
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  Monitor environmental impact
                </div>
              </div>
              <div className="mt-6">
                <span className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium group-hover:bg-primary-700 transition-colors">
                  Sign Up as User
                </span>
              </div>
            </div>
          </Link>

          <Link to="/company/signup" className="group">
            <div className="card hover:shadow-xl transition-all duration-300 group-hover:scale-105 text-center p-8">
              <div className="bg-eco-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-eco-200 transition-colors">
                <Building2 className="h-10 w-10 text-eco-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Company</h2>
              <p className="text-gray-600 mb-6">
                Register your company to manage corporate e-waste programs and partnerships.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-eco-600 rounded-full mr-3"></div>
                  Manage corporate e-waste programs
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-eco-600 rounded-full mr-3"></div>
                  Access business analytics
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-eco-600 rounded-full mr-3"></div>
                  B2B marketplace participation
                </div>
              </div>
              <div className="mt-6">
                <span className="bg-eco-600 text-white px-6 py-3 rounded-lg font-medium group-hover:bg-eco-700 transition-colors">
                  Sign Up as Company
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupChoice;