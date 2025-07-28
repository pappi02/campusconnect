import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaChartLine, FaCalendarAlt, FaDownload, FaFilter, FaClock, FaWallet } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CustomFooter from '../components/CustomFooter';
import api from '../api';

const DeliveryEarnings = () => {
  const [earnings, setEarnings] = useState({
    total: 0,
    today: 0,
    week: 0,
    month: 0,
    pending: 0,
    available: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchEarningsData();
  }, [selectedPeriod]);

  const fetchEarningsData = async () => {
    try {
      const response = await api.get('/api/delivery/earnings/', {
        params: { range: selectedPeriod }
      });
      
      const earningsData = response.data;
      setEarnings({
        total: parseFloat(earningsData.total),
        today: parseFloat(earningsData.today),
        week: parseFloat(earningsData.week),
        month: parseFloat(earningsData.month),
        pending: parseFloat(earningsData.pending),
        available: parseFloat(earningsData.available)
      });

      // Fetch transactions
      const transactionsResponse = await api.get('/api/delivery/transactions/');
      const transactionsData = transactionsResponse.data;
      
      setTransactions(transactionsData.map(transaction => ({
        id: transaction.id,
        date: transaction.created_at,
        type: transaction.transaction_type,
        amount: parseFloat(transaction.amount),
        status: transaction.status,
        details: transaction.description
      })));

      // Generate chart data based on selected period
      const chartResponse = await api.get('/api/delivery/history/', {
        params: { date_range: selectedPeriod }
      });
      
      const deliveries = chartResponse.data.deliveries;
      const chartData = generateChartData(deliveries, selectedPeriod);
      
      setChartData(chartData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching earnings:', err);
      setLoading(false);
    }
  };

  const generateChartData = (deliveries, period) => {
    const data = [];
    const today = new Date();
    
    if (period === 'week') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - i));
        const dayDeliveries = deliveries.filter(d => 
          new Date(d.completed_at).toDateString() === date.toDateString()
        );
        const earnings = dayDeliveries.reduce((sum, d) => sum + parseFloat(d.total_earnings), 0);
        data.push({ label: days[i], earnings });
      }
    } else if (period === 'month') {
      for (let i = 0; i < 30; i += 5) {
        const date = new Date(today);
        date.setDate(date.getDate() - (29 - i));
        const weekDeliveries = deliveries.filter(d => {
          const deliveryDate = new Date(d.completed_at);
          return deliveryDate >= new Date(today.getTime() - (29 - i + 5) * 24 * 60 * 60 * 1000) &&
                 deliveryDate < new Date(today.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
        });
        const earnings = weekDeliveries.reduce((sum, d) => sum + parseFloat(d.total_earnings), 0);
        data.push({ label: `Week ${Math.floor(i/5) + 1}`, earnings });
      }
    }
    
    return data;
  };

  const generateChart = () => {
    const canvas = document.getElementById('earningsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (!chartData || chartData.length === 0) {
      // Display a message when there's no data
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No earnings data available', width / 2, height / 2);
      return;
    }

    const maxValue = Math.max(...chartData.map(d => d.earnings));
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Handle case where all earnings are zero
    if (!isFinite(maxValue) || maxValue <= 0) {
      // Draw empty chart with axes
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();

      // Display zero earnings message
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No earnings for this period', width / 2, height / 2);
      
      // Draw labels for zero values
      const barWidth = chartWidth / chartData.length;
      chartData.forEach((data, index) => {
        const x = padding + index * barWidth + barWidth * 0.1;
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(data.label, x + barWidth * 0.4, height - padding + 15);
      });
      return;
    }

    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw bars
    const barWidth = chartWidth / chartData.length;
    chartData.forEach((data, index) => {
      const barHeight = Math.max(0, (data.earnings / maxValue) * chartHeight);
      const x = padding + index * barWidth + barWidth * 0.1;
      const y = Math.max(padding, height - padding - barHeight);

      // Ensure y is a finite number
      if (!isFinite(y)) return;

      // Gradient fill - ensure coordinates are finite
      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, '#fbbf24');
      gradient.addColorStop(1, '#f59e0b');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth * 0.8, Math.max(0, barHeight));

      // Labels
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(data.label, x + barWidth * 0.4, height - padding + 15);
    });
  };

  useEffect(() => {
    generateChart();
  }, [chartData]);

  const exportEarningsReport = () => {
    const report = {
      summary: earnings,
      transactions: transactions,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-report-${selectedPeriod}.json`;
    a.click();
  };

  if (loading) {
    return (
      <div className="mt-30 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-30 min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings Dashboard</h1>
            <p className="text-gray-600">Track your delivery earnings and financial performance</p>
          </div>
          <Link
            to="/delivery/dashboard"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition mt-4 md:mt-0"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <FaWallet className="text-3xl mr-4" />
              <div>
                <p className="text-green-100 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold">${earnings.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-3xl mr-4" />
              <div>
                <p className="text-blue-100 text-sm">Today's Earnings</p>
                <p className="text-2xl font-bold">${earnings.today.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <FaCalendarAlt className="text-3xl mr-4" />
              <div>
                <p className="text-purple-100 text-sm">This Week</p>
                <p className="text-2xl font-bold">${earnings.week.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <FaCalendarAlt className="text-3xl mr-4" />
              <div>
                <p className="text-indigo-100 text-sm">This Month</p>
                <p className="text-2xl font-bold">${earnings.month.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <FaClock className="text-3xl mr-4" />
              <div>
                <p className="text-yellow-100 text-sm">Pending</p>
                <p className="text-2xl font-bold">${earnings.pending.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-400 to-teal-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <FaWallet className="text-3xl mr-4" />
              <div>
                <p className="text-teal-100 text-sm">Available</p>
                <p className="text-2xl font-bold">${earnings.available.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Earnings Trend</h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <canvas id="earningsChart" width="600" height="300" className="w-full"></canvas>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average per delivery</span>
                <span className="font-bold">
                  ${(transactions.filter(t => t.type === 'delivery').length > 0 ? 
                    earnings.total / transactions.filter(t => t.type === 'delivery').length : 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Highest earning day</span>
                <span className="font-bold text-green-600">
                  ${Math.max(...chartData.map(d => d.earnings || 0)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total deliveries</span>
                <span className="font-bold">{transactions.filter(t => t.type === 'delivery').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Success rate</span>
                <span className="font-bold text-green-600">
                  {((transactions.filter(t => t.type === 'delivery' && t.status === 'completed').length / 
                    transactions.filter(t => t.type === 'delivery').length || 0) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <button
              onClick={exportEarningsReport}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center"
            >
              <FaDownload className="mr-2" />
              Export Report
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.type === 'delivery' ? 'bg-blue-100 text-blue-800' :
                        transaction.type === 'bonus' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CustomFooter />
    </div>
  );
};

export default DeliveryEarnings;
