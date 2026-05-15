import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, Search, Filter, Loader } from 'lucide-react';
import CompanyLayout from '../components/CompanyLayout';
import api from '../services/api';

const CompanyTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await api.getCompanyTransactions();
        setTransactions(data);
      } catch (err) {
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    (t.referenceId && t.referenceId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.partner && t.partner.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.type && t.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <CompanyLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
          <p className="text-gray-600">View all your collection and sale transactions</p>
        </div>
      </div>

      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, partner, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-primary-600">
            <Loader className="animate-spin h-8 w-8 mr-2" /> Loading Transactions...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg text-gray-500 border border-gray-200">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-500">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Partner</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => {
                  const isIncome = transaction.type === 'sale';
                  const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
                  const iconColor = isIncome ? 'text-green-600 bg-green-100' : 'text-blue-600 bg-blue-100';

                  return (
                    <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {transaction.referenceId || transaction._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {transaction.partner || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`p-1 rounded-full mr-2 ${iconColor}`}>
                            <Icon className="h-3 w-3" />
                          </div>
                          <span className="capitalize">{transaction.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${isIncome ? 'text-green-600' : 'text-blue-600'}`}>
                          {isIncome ? '+' : '-'}₹{transaction.amount ? transaction.amount.toLocaleString('en-IN') : 0}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {transaction.status || 'Completed'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CompanyLayout>
  );
};

export default CompanyTransactions;
