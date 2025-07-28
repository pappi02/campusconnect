import React, { useState, useEffect } from 'react';
import { FaTruck, FaCalendarAlt, FaMoneyBillWave, FaStar, FaMapMarkerAlt, FaClock, FaUser, FaFilter, FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CustomFooter from '../components/CustomFooter';
import api from '../api';

const DeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDeliveryHistory();
  }, []);

  useEffect(() => {
    filterDeliveries();
  }, [deliveries, filterStatus, dateRange, searchTerm]);

  const fetchDeliveryHistory = async () => {
    try {
      const response = await api.get('/api/delivery/history/', {
        params: {
          status: filterStatus,
          date_range: dateRange,
          search: searchTerm
        }
      });
      
      const deliveriesData = response.data.deliveries;
      setDeliveries(deliveriesData.map(d => ({
        id: d.id,
        customer_name: d.customer_name,
        address: d.address,
        amount: parseFloat(d.total_earnings),
        status: d.status,
        completed_at: d.completed_at,
        rating: d.rating ? parseFloat(d.rating) : null
      })));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching delivery history:', err);
      setLoading(false);
    }
  };

  const filterDeliveries = () => {
    let filtered = [...deliveries];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === filterStatus);
    }

    if (dateRange !== 'all') {
      const now = new Date();
      const daysMap = {
        'today': 1,
        'week': 7,
        'month': 30,
        'year': 365
      };
      const days = daysMap[dateRange];
      const cutoff = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
      filtered = filtered.filter(delivery => new Date(delivery.completed_at) >= cutoff);
    }

    if (searchTerm) {
      filtered = filtered.filter(delivery => 
        delivery.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDeliveries(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'failed': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Customer', 'Address', 'Amount', 'Status', 'Rating'],
      ...filteredDeliveries.map(d => [
        new Date(d.completed_at).toLocaleDateString(),
        d.customer_name,
        d.address,
        `$${d.amount}`,
        d.status,
        d.rating || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'delivery-history.csv';
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
            <h1 className="text-3xl font-bold text-gray-900">Delivery History</h1>
            <p className="text-gray-600">Track your completed deliveries and performance</p>
          </div>
          <Link
            to="/delivery/dashboard"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition mt-4 md:mt-0"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaTruck className="text-blue-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Total Deliveries</p>
                <p className="text-2xl font-bold">{deliveries.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-green-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold">
                  ${deliveries.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaStar className="text-yellow-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {(deliveries.reduce((sum, d) => sum + parseFloat(d.rating || 0), 0) / deliveries.filter(d => d.rating).length || 0).toFixed(1)}/5
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaCalendarAlt className="text-purple-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-500 text-sm">This Month</p>
                <p className="text-2xl font-bold">
                  {deliveries.filter(d => {
                    const deliveryDate = new Date(d.completed_at);
                    const now = new Date();
                    return deliveryDate.getMonth() === now.getMonth() && deliveryDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by customer or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={exportToCSV}
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition flex items-center"
              >
                <FaDownload className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Delivery List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Delivery Records</h2>
          </div>
          
          {filteredDeliveries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FaTruck className="text-4xl mx-auto mb-4 opacity-50" />
              <p>No deliveries found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredDeliveries.map(delivery => (
                <div key={delivery.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <FaUser className="text-gray-400 mr-2" />
                        <span className="font-medium">{delivery.customer_name}</span>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{delivery.address}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 text-sm">
                        <FaClock className="mr-2" />
                        <span>{new Date(d.completed_at).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-2xl font-bold text-green-600">${delivery.amount}</p>
                      {delivery.rating && (
                        <div className="flex items-center justify-end mt-1">
                          <FaStar className="text-yellow-500 mr-1" />
                          <span className="text-sm">{delivery.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CustomFooter />
    </div>
  );
};

export default DeliveryHistory;
