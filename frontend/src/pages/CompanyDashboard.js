import React, { useState, useEffect } from 'react';
import { BarChart as BarChartIcon, TrendingUp, Users, IndianRupee, Package, FileText, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import CompanyLayout from '../components/CompanyLayout';
import api from '../services/api';

const CompanyDashboard = () => {
  const [companyStats, setCompanyStats] = useState({
    totalCollected: 0,
    monthlyRevenue: 0,
    activePartners: 0,
    recyclingRate: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, transactions, impactStats] = await Promise.all([
          api.getCompanyStats(),
          api.getCompanyTransactions(),
          api.getPublicImpact().catch(() => ({ totalCO2Saved: 16 }))
        ]);

        setCompanyStats({
          totalCollected: stats.totalCollected || 0,
          monthlyRevenue: stats.monthlyRevenue || 0,
          activePartners: stats.activePartners || 0,
          recyclingRate: stats.recyclingRate || 0,
          co2Prevented: impactStats.totalCO2Saved || 16
        });

        setAllTransactions(transactions);
        setRecentTransactions(transactions.slice(0, 5));
      } catch (err) {
        console.error('Error fetching company dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <CompanyLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-primary-600">Loading your dashboard...</div>
        </div>
      </CompanyLayout>
    );
  }

  const uniquePartners = new Set(allTransactions.map(t => t.partner).filter(Boolean)).size;
  const displayPartners = uniquePartners > 0 ? uniquePartners : (companyStats.activePartners || 45);

  const displayTotalCollected = companyStats.totalCollected || 0;
  const displayRecyclingRate = companyStats.recyclingRate || 0;

  const eWasteProcessed = displayTotalCollected;
  const co2Prevented = companyStats.co2Prevented || 16;
  const landfillSaved = Math.round(eWasteProcessed * 0.0081);

  const processChartData = (transactions) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dataMap = {};
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      dataMap[`${months[d.getMonth()]} ${d.getFullYear()}`] = { name: months[d.getMonth()], amount: 0 };
    }

    transactions.forEach(t => {
      const d = new Date(t.createdAt);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      if (dataMap[key] && t.type !== 'collection') {
        dataMap[key].amount += (t.amount || 0);
      }
    });

    return Object.values(dataMap);
  };
  const chartData = processChartData(allTransactions);

  return (
    <CompanyLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
        <p className="text-gray-600">Monitor your e-waste management operations and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Collected</p>
              <p className="text-2xl font-bold text-gray-900">{displayTotalCollected.toLocaleString()} kg</p>
            </div>
            <Package className="h-8 w-8 text-eco-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{companyStats.monthlyRevenue.toLocaleString('en-IN')}</p>
            </div>
            <IndianRupee className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Partners</p>
              <p className="text-2xl font-bold text-gray-900">{displayPartners}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recycling Rate</p>
              <p className="text-2xl font-bold text-gray-900">{displayRecyclingRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/company/reports" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-eco-50 hover:border-eco-300 transition-colors">
            <FileText className="h-8 w-8 text-eco-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Generate Report</h3>
              <p className="text-sm text-gray-600">Create analytics reports</p>
            </div>
          </Link>

          <Link to="/company/marketplace" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
            <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Browse Marketplace</h3>
              <p className="text-sm text-gray-600">Buy/sell materials</p>
            </div>
          </Link>

          <Link to="/company/partnerships" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
            <Users className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Manage Partners</h3>
              <p className="text-sm text-gray-600">View partnerships</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Performance</h2>
        <div className="h-64 bg-white rounded-lg flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
              <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <Link to="/company/transactions" className="text-eco-600 hover:text-eco-700 font-medium">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  transaction.type === 'collection' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{transaction._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{transaction.partner || 'N/A'} • {new Date(transaction.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.type === 'collection' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {transaction.type === 'collection' ? '-' : '+'}₹{transaction.amount ? transaction.amount.toLocaleString('en-IN') : 0}
                </p>
                <p className="text-sm text-gray-500">{transaction.type ? transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) : ''}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="card bg-gradient-to-r from-eco-50 to-green-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Environmental Impact This Month</h2>
          <p className="text-gray-600 mb-6">Your company's contribution to sustainability</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-eco-600">{eWasteProcessed.toLocaleString()} kg</p>
              <p className="text-sm text-gray-600">E-Waste Processed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{co2Prevented.toLocaleString()} kg</p>
              <p className="text-sm text-gray-600">CO₂ Emissions Prevented</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">{landfillSaved.toLocaleString()} m²</p>
              <p className="text-sm text-gray-600">Landfill Space Saved</p>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyDashboard;