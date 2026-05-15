import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import api from '../services/api';

const SubmitDevice = () => {
  const navigate = useNavigate();
  const [deviceForm, setDeviceForm] = useState({ deviceType: '', brand: '', condition: '', imei: '' });
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [geoError, setGeoError] = useState('');
  const [geoLoading, setGeoLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      setGeoLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGeoLoading(false);
      },
      (err) => {
        setGeoError('Unable to retrieve your location. Please allow location access.');
        setGeoLoading(false);
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!location) {
      setError('Geolocation is required. Please enable location services.');
      setLoading(false);
      return;
    }

    if (!imageFile) {
      setError('Device image proof is required.');
      setLoading(false);
      return;
    }

    if (!deviceForm.imei || deviceForm.imei.length !== 15 || !/^\d{15}$/.test(deviceForm.imei)) {
      setError('IMEI must be exactly 15 numeric digits.');
      setLoading(false);
      return;
    }

    // Calculate simulated points/value to meet Schema strict requirements
    const estimatedValue = deviceForm.condition === 'working' ? 100 : (deviceForm.condition === 'needs_repair' ? 40 : 10);
    const ecoPoints = deviceForm.condition === 'working' ? 50 : (deviceForm.condition === 'needs_repair' ? 70 : 100);

    const formData = new FormData();
    formData.append('deviceType', deviceForm.deviceType);
    formData.append('brand', deviceForm.brand);
    formData.append('condition', deviceForm.condition);
    formData.append('imei', deviceForm.imei);
    formData.append('estimatedValue', estimatedValue);
    formData.append('ecoPoints', ecoPoints);
    formData.append('source', 'manual');
    formData.append('lat', location.lat);
    formData.append('lng', location.lng);
    formData.append('image', imageFile);

    try {
      const response = await api.submitDevice(formData);
      console.log("Submit success, API Response:", response);
      alert('Device successfully processed and approved!');
      navigate('/user/dashboard');
    } catch (err) {
      console.error("Submission failed:", err);
      setError(err.message || 'Failed to submit device. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto py-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Submit New Device</h2>
          <p className="text-sm text-gray-500 mb-6">Manual entry — Auto Approval enabled if all checks pass.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-700 bg-red-100 p-3 rounded-md">{error}</div>}
            
            {geoLoading ? (
              <div className="text-blue-700 bg-blue-100 p-3 rounded-md">Acquiring GPS location...</div>
            ) : geoError ? (
              <div className="text-red-700 bg-red-100 p-3 rounded-md">{geoError}</div>
            ) : (
              <div className="text-green-700 bg-green-100 p-3 rounded-md flex items-center">
                <span>📍 Location Acquired ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
              <select 
                value={deviceForm.deviceType} 
                onChange={(e) => setDeviceForm({...deviceForm, deviceType: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded" 
                required
              >
                <option value="">Select a device</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Laptop">Laptop</option>
                <option value="Tablet">Tablet</option>
                <option value="Desktop">Desktop / PC</option>
                <option value="TV">Television</option>
                <option value="Other">Other Electronics</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand/Make</label>
              <input 
                type="text"
                value={deviceForm.brand} 
                onChange={(e) => setDeviceForm({...deviceForm, brand: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded" 
                placeholder="e.g. Apple, Samsung, Dell"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IMEI Number</label>
              <input 
                type="text"
                value={deviceForm.imei} 
                onChange={(e) => setDeviceForm({...deviceForm, imei: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded" 
                placeholder="15-digit IMEI number"
                pattern="\d{15}"
                title="IMEI must be exactly 15 digits"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select 
                value={deviceForm.condition} 
                onChange={(e) => setDeviceForm({...deviceForm, condition: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded" 
                required
              >
                <option value="">Select condition</option>
                <option value="working">Working perfectly</option>
                <option value="needs_repair">Needs minor repair</option>
                <option value="broken">Completely dead/broken</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Device Image Proof</label>
              <input 
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded bg-gray-50" 
                required
              />
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button 
                type="button" 
                onClick={() => navigate('/user/dashboard')}
                className="w-1/2 bg-gray-200 text-gray-800 p-3 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading || geoLoading || !!geoError}
                className={`w-1/2 p-3 rounded text-white transition-colors ${loading || geoLoading || geoError ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {loading ? 'Processing...' : 'Submit Device'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default SubmitDevice;
