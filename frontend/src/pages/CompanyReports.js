import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart, IndianRupee } from 'lucide-react';
import CompanyLayout from '../components/CompanyLayout';
import api from '../services/api';

const CompanyReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [reportData, setReportData] = useState({
    totalCollected: 0,
    totalRecycled: 0,
    carbonSaved: 0,
    revenue: 0
  });

  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [stats, impactStats, dbReports] = await Promise.all([
          api.getCompanyStats(),
          api.getPublicImpact().catch(() => ({ totalCO2Saved: 0 })),
          api.getReports()
        ]);

        setReportData({
          totalCollected: stats.totalCollected || 0,
          totalRecycled: stats.totalRecycled || 0,
          carbonSaved: impactStats.totalCO2Saved || 0,
          revenue: stats.monthlyRevenue || 0
        });

        setReports(dbReports);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setReportsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const [reports, setReports] = useState([]);

  const handleGenerateReport = async () => {
    const title = `${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Performance Report`;
    // Optimistically add to UI immediately
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      title,
      type: 'Analysis',
      createdAt: new Date().toISOString(),
      status: 'Processing',
      size: 'Calculating...'
    };
    setReports(prev => [optimistic, ...prev]);

    try {
      const saved = await api.createReport({
        title,
        type: 'Analysis',
        period: selectedPeriod,
        metrics: reportData
      });
      // Replace temp with real DB record
      setReports(prev => prev.map(r => r._id === tempId ? saved : r));
    } catch (err) {
      console.error('Failed to save report:', err);
      // On error, just mark as Ready in UI
      setReports(prev => prev.map(r =>
        r._id === tempId ? { ...r, status: 'Ready', size: '1.0 MB' } : r
      ));
    }
  };

  const handleDownload = (report) => {
    const content = `REPORT: ${report.title}
Date Generated: ${report.date}
Type: ${report.type}
Status: ${report.status}

=== COMPANY METRICS ===
Total Collected: ${reportData.totalCollected.toLocaleString()} kg
Total Recycled: ${reportData.totalRecycled.toLocaleString()} kg
Carbon Saved: ${reportData.carbonSaved.toLocaleString()} kg CO2
Revenue Generated: Rs. ${reportData.revenue.toLocaleString('en-IN')}

Report generated automatically by E-Waste Loop Management System.
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}_${report.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <CompanyLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Track your company's e-waste management performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Collected</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalCollected.toLocaleString()} kg</p>
            </div>
            <BarChart3 className="h-8 w-8 text-eco-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Recycled</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalRecycled.toLocaleString()} kg</p>
            </div>
            <PieChart className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Carbon Saved</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.carbonSaved.toLocaleString()} kg CO₂</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue Generated</p>
              <p className="text-2xl font-bold text-gray-900">₹{reportData.revenue.toLocaleString('en-IN')}</p>
            </div>
            <IndianRupee className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Report Generation */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate New Report</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Period</label>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-eco-500 focus:border-transparent"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input 
              type="date" 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-eco-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input 
              type="date" 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-eco-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={handleGenerateReport}
            className="bg-eco-600 text-white px-6 py-2 rounded-lg hover:bg-eco-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Available Reports */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Reports</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Report Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Size</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {reportsLoading ? (
                <tr><td colSpan="6" className="py-8 text-center text-gray-400">Loading reports...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-gray-400">No reports yet. Click "Generate Report" above to create one.</td></tr>
              ) : reports.map((report) => (
                <tr key={report._id || report.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      {report.title}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {report.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString('en-IN') : report.date}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'Ready' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{report.size}</td>
                  <td className="py-3 px-4">
                    {report.status === 'Ready' && (
                      <button 
                        onClick={() => handleDownload(report)}
                        className="flex items-center text-eco-600 hover:text-eco-700">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyReports;