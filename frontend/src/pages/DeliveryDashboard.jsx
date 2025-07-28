import React, { useState, useEffect } from 'react';
import { FaTruck, FaMotorcycle, FaBicycle, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaPowerOff } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CustomFooter from '../components/CustomFooter';
import api from '../api';
import { showToast } from "../utils/toastUtils";

const DeliveryDashboard = () => {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [stats, setStats] = useState({
    completed: 0,
    earnings: '$0.00',
    rating: '0.0'
  });
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    checkOnlineStatus();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/delivery/dashboard/');
      setActiveDeliveries(response.data.active_deliveries || []);
      setStats({
        completed: response.data.completed_deliveries || 0,
        earnings: `$${response.data.total_earnings || '0.00'}`,
        rating: response.data.average_rating || '0.0'
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    }
  };

  const checkOnlineStatus = async () => {
    try {
      const response = await api.get('/api/delivery/status/');
      setIsOnline(response.data.is_online || false);
    } catch (err) {
      console.error('Error checking online status:', err);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !isOnline;
      await api.post('/api/delivery/status/', { is_online: newStatus });
      setIsOnline(newStatus);
      
      // Show toast notification
      if (newStatus) {
        showToast("You are now online. Available for delivery assignments", "success");
      } else {
        showToast("You are now offline", "info");
      }
      
    } catch (err) {
      console.error('Error toggling online status:', err);
      alert('Failed to update online status. Please try again.');
      
    }
  };

  const handleAvailableDeliveries = () => {
    navigate('/delivery/available');
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
            <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your delivery overview</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button
              onClick={handleAvailableDeliveries}
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              Available Deliveries
            </button>
            <button
              onClick={toggleOnlineStatus}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center ${
                isOnline 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <FaPowerOff className="mr-2" />
              {isOnline ? 'Online' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaTruck className="text-yellow-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Completed Deliveries</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-green-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold">{stats.earnings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaClock className="text-blue-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Average Rating</p>
                <p className="text-2xl font-bold">{stats.rating}/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Active Deliveries</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {activeDeliveries.map(delivery => (
              <div key={delivery.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{delivery.customer}</h3>
                    <div className="flex items-center mt-1 text-gray-600">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{delivery.address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{delivery.amount}</p>
                    <div className="flex items-center justify-end mt-1 text-gray-600">
                      <FaClock className="mr-2" />
                      <span>{delivery.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-3">
                  <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm font-medium hover:bg-yellow-600">
                    Start Delivery
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/delivery/history" 
            className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50 transition"
          >
            <FaClock className="mx-auto text-2xl text-gray-600 mb-2" />
            <p className="font-medium">Delivery History</p>
          </Link>
          <Link 
            to="/delivery/earnings" 
            className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50 transition"
          >
            <FaMoneyBillWave className="mx-auto text-2xl text-green-500 mb-2" />
            <p className="font-medium">Earnings</p>
          </Link>
          <Link 
            to="/delivery/schedule" 
            className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50 transition"
          >
            <FaClock className="mx-auto text-2xl text-blue-500 mb-2" />
            <p className="font-medium">Schedule</p>
          </Link>
          <Link 
            to="/delivery/settings" 
            className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50 transition"
          >
            <FaTruck className="mx-auto text-2xl text-gray-600 mb-2" />
            <p className="font-medium">Settings</p>
          </Link>
        </div>
      </div>

      <CustomFooter />
    </div>
  );
};

export default DeliveryDashboard;
