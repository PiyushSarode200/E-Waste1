import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Edit } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import CompanyLayout from '../components/CompanyLayout';

const Profile = () => {
  const location = useLocation();
  const isCompanyRoute = location.pathname.startsWith('/company/');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      name: user.name || 'User',
      email: user.email || 'user@example.com',
      phone: user.phone || '',
      address: user.address || '',
      bio: user.bio || '',
      ecoPoints: user.ecoPoints || 0,
      totalDevicesRecycled: user.totalDevicesRecycled || 0,
      totalCO2Saved: user.totalCO2Saved || 0
    };
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const stats = await response.json();
        setUserData(prev => ({ ...prev, ...stats }));
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUserData(prev => ({ ...prev, ...data.user }));
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const content = (
    <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card text-center">
              <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{userData.name}</h2>
              <p className="text-gray-600 mb-4">{userData.email}</p>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`w-full inline-flex items-center justify-center ${
                  isEditing ? 'btn-secondary' : 'btn-primary'
                }`}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                {isEditing && (
                  <button onClick={handleSave} className="btn-primary inline-flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{userData.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{userData.email}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                        {userData.phone || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter address"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                        {userData.address || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={userData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[100px]">
                      {userData.bio || 'No bio provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="mt-8">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 mb-1">{userData.totalDevicesRecycled || 0}</div>
                <div className="text-sm text-gray-600">Devices Recycled</div>
              </div>
              <div className="text-center p-4 bg-eco-50 rounded-lg">
                <div className="text-2xl font-bold text-eco-600 mb-1">{userData.ecoPoints || 0}</div>
                <div className="text-sm text-gray-600">Eco Points Earned</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">{userData.totalCO2Saved || 0}kg</div>
                <div className="text-sm text-gray-600">CO₂ Saved</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );

  return isCompanyRoute ? (
    <CompanyLayout>{content}</CompanyLayout>
  ) : (
    <UserLayout>{content}</UserLayout>
  );
};

export default Profile;