import React, { useState, useEffect } from 'react';
import { Leaf, Recycle, Award, TrendingUp, Users, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import UserLayout from '../components/UserLayout';
import api from '../services/api';

const COLORS = ['#16a34a', '#2563eb', '#9333ea', '#ea580c', '#eab308'];

const ImpactDashboard = () => {
  const [impactStats, setImpactStats] = useState([]);
  const [chartData, setChartData] = useState({
    monthlyData: [],
    deviceDistribution: [],
    co2Trend: [],
    rewardsData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [publicStats, charts, userStats] = await Promise.all([
          api.getPublicImpact(),
          api.getImpactStats(),
          api.getUserStats()
        ]);
        
        setImpactStats([
          {
            icon: Recycle,
            title: 'Your Devices Recycled',
            value: userStats.totalDevicesRecycled?.toLocaleString() || '0',
            change: '',
            color: 'text-primary-600',
            bgColor: 'bg-primary-100'
          },
          {
            icon: Leaf,
            title: 'Your CO₂ Emissions Saved (kg)',
            value: userStats.totalCO2Saved?.toLocaleString() || '0',
            change: '',
            color: 'text-eco-600',
            bgColor: 'bg-eco-100'
          },
          {
            icon: TrendingUp,
            title: 'Total E-Waste Contributed (kg)',
            value: charts.totalWeight?.toLocaleString() || '0',
            change: '',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          }
        ]);

        setChartData(charts);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const globalImpact = [
    { metric: 'Landfill Waste Reduced', value: '125 tons', icon: '🗑️' },
    { metric: 'Precious Metals Recovered', value: '45 kg', icon: '💎' },
    { metric: 'Energy Saved', value: '2.3 MWh', icon: '⚡' },
    { metric: 'Water Saved', value: '15K liters', icon: '💧' }
  ];

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-primary-600">Loading your impact stats...</div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact Dashboard</h1>
          <p className="text-gray-600">Track the environmental and economic impact of our e-waste recycling efforts</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {impactStats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Recycling Trends */}
          <div className="card flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Recycling Trends</h2>
            <div className="h-72 w-full flex-grow flex items-center justify-center">
              {chartData.totalDevices === 0 ? (
                <p className="text-gray-500 font-medium">No data available yet 🚫</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                    <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                    <Bar dataKey="devices" name="Devices Recycled" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Device Type Distribution */}
          <div className="card flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Device Type Distribution</h2>
            <div className="h-72 w-full flex-grow flex items-center justify-center">
              {chartData.totalDevices === 0 ? (
                <p className="text-gray-500 font-medium">No data available yet 🚫</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.deviceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : null}
                    >
                      {chartData.deviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* CO2 Savings & Value Generation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* CO2 Savings Trend */}
          <div className="card flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-6">CO₂ Savings Over Time</h2>
            <div className="h-72 w-full flex-grow flex items-center justify-center">
              {chartData.totalDevices === 0 ? (
                <p className="text-gray-500 font-medium">No data available yet 🚫</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.co2Trend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                    <Tooltip cursor={{ stroke: '#F3F4F6', strokeWidth: 2 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="co2" name="CO₂ Saved (kg)" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Rewards Distribution */}
          <div className="card flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Rewards Distribution</h2>
            <div className="h-72 w-full flex-grow flex items-center justify-center">
              {chartData.totalDevices === 0 && chartData.rewardsData?.reduce((acc, curr) => acc + curr.earned + curr.redeemed, 0) === 0 ? (
                <p className="text-gray-500 font-medium">No data available yet 🚫</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.rewardsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                    <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                    <Bar dataKey="earned" name="Points Earned" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="redeemed" name="Points Redeemed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

    </UserLayout>
  );
};

export default ImpactDashboard;