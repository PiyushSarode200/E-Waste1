import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, Upload, Coins, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import QRScanner from '../components/QRScanner';

const Dashboard = () => {
  const [qrResult, setQrResult] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    deviceType: '',
    brand: '',
    condition: '',
    photo: null
  });
  const [valuation, setValuation] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [userStats, setUserStats] = useState({
    ecoPoints: 0,
    totalDevicesRecycled: 0,
    totalCO2Saved: 0
  });

  const fileInputRef = useRef(null);

  const deviceTypes = ['Smartphone', 'Laptop', 'Desktop', 'Tablet', 'TV', 'Monitor', 'Other'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor', 'Not Working'];

  const calculateValuation = () => {
    if (!formData.deviceType || !formData.condition) return;
    
    const baseValues = {
      'Smartphone': 400,
      'Laptop': 600,
      'Desktop': 300,
      'Tablet': 250,
      'TV': 350,
      'Monitor': 200,
      'Other': 100
    };

    const conditionMultipliers = {
      'Excellent': 1.0,
      'Good': 0.8,
      'Fair': 0.6,
      'Poor': 0.4,
      'Not Working': 0.2
    };

    const baseValue = baseValues[formData.deviceType] || 100;
    const multiplier = conditionMultipliers[formData.condition] || 0.5;
    const estimatedValue = Math.round(baseValue * multiplier);
    const ecoPoints = Math.round(estimatedValue * 0.2);

    setValuation({ value: estimatedValue, points: ecoPoints });
  };

  useEffect(() => {
    fetchUserStats();
    fetchTransactions();
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.map(t => ({
          id: t._id,
          device: `${t.deviceId?.brand || ''} ${t.deviceId?.deviceType || ''}`,
          value: t.amount,
          points: t.points,
          status: t.status === 'completed' ? 'sold' : t.status,
          date: new Date(t.createdAt).toISOString().split('T')[0]
        })));
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (valuation) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/devices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            deviceType: formData.deviceType,
            brand: formData.brand,
            condition: formData.condition,
            estimatedValue: valuation.value,
            ecoPoints: valuation.points,
            qrCode: qrResult
          })
        });
        
        if (response.ok) {
          setFormData({ deviceType: '', brand: '', condition: '', photo: null });
          setValuation(null);
          setQrResult('');
          fetchUserStats();
          fetchTransactions();
          alert('Device submitted successfully!');
        } else {
          const error = await response.json();
          alert(error.message);
        }
      } catch (error) {
        alert('Failed to submit device. Please try again.');
      }
    }
  };

  const handleQRScan = (qrData) => {
    setQrResult(qrData);
    
    // Auto-fill form based on QR data patterns
    if (qrData.includes('SMARTPHONE') || qrData.includes('smartphone')) {
      setFormData({
        ...formData,
        deviceType: 'Smartphone',
        brand: qrData.includes('APPLE') || qrData.includes('apple') ? 'Apple' : formData.brand
      });
    } else if (qrData.includes('LAPTOP') || qrData.includes('laptop')) {
      setFormData({
        ...formData,
        deviceType: 'Laptop'
      });
    } else if (qrData.includes('TABLET') || qrData.includes('tablet')) {
      setFormData({
        ...formData,
        deviceType: 'Tablet'
      });
    }
    
    setShowScanner(false);
    
    // Show success message
    if (qrData.startsWith('http://') || qrData.startsWith('https://')) {
      alert('QR code scanned successfully! Link has been opened in a new tab.');
    } else {
      alert('QR code scanned successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Scan, submit, and track your e-waste recycling</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QR Scanner & Entry Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* QR Scanner Section */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Scan QR Code</h2>
              <div className="space-y-4">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                  <button
                    onClick={() => setShowScanner(true)}
                    className="btn-primary inline-flex items-center"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Start QR Scanner
                  </button>
                </div>
                
                {qrResult && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">QR Code Detected:</p>
                    <p className="text-green-600 text-sm">{qrResult}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter code manually
                  </label>
                  <input
                    type="text"
                    value={qrResult}
                    onChange={(e) => setQrResult(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter QR code manually"
                  />
                </div>
              </div>
            </div>

            {/* E-Waste Entry Form */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Device Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
                    <select
                      value={formData.deviceType}
                      onChange={(e) => setFormData({...formData, deviceType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select device type</option>
                      {deviceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter brand name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select condition</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload device photo</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={calculateValuation}
                    className="btn-secondary flex-1"
                    disabled={!formData.deviceType || !formData.condition}
                  >
                    Calculate Value
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={!valuation}
                  >
                    Submit Device
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Valuation Display */}
            {valuation && (
              <div className="card bg-primary-50 border-2 border-primary-200">
                <h3 className="text-lg font-bold text-primary-900 mb-4">Estimated Valuation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-700">Market Value:</span>
                    <span className="text-2xl font-bold text-primary-900">₹{valuation.value}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-700">Eco Points:</span>
                    <span className="text-xl font-bold text-eco-600">{valuation.points} pts</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Coins className="h-5 w-5 text-primary-600" />
                    <span className="text-gray-700">Total Points</span>
                  </div>
                  <span className="font-bold text-primary-600">{userStats.ecoPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-eco-600" />
                    <span className="text-gray-700">Devices Recycled</span>
                  </div>
                  <span className="font-bold text-eco-600">{userStats.totalDevicesRecycled}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Log */}
        <div className="mt-8">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Transaction History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Device</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Value</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Points</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{transaction.device}</td>
                      <td className="py-3 px-4 text-gray-700">₹{transaction.value}</td>
                      <td className="py-3 px-4 text-primary-600">{transaction.points} pts</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'sold' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status === 'sold' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {transaction.status === 'processing' && <Clock className="h-3 w-3 mr-1" />}
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{transaction.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {showScanner && (
        <QRScanner 
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;