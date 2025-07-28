import React, { useState, useEffect } from 'react';
import { FaTruck, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CustomFooter from '../components/CustomFooter';
import api from '../api';

const AvailableDeliveries = () => {
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableDeliveries();
  }, []);

  const fetchAvailableDeliveries = async () => {
    try {
      const response = await api.get('/api/delivery/available/');
      setAvailableDeliveries(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching available deliveries:', err);
      setError('Failed to load available deliveries');
      setLoading(false);
    }
  };

  const acceptDelivery = async (deliveryId) => {
    try {
      await api.post(`/api/delivery/${deliveryId}/accept/`);
      // Refresh the list after accepting
      fetchAvailableDeliveries();
    } catch (err) {
      console.error('Error accepting delivery:', err);
      alert('Failed to accept delivery. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
        <CustomFooter />
      </div>
    );
  }

  return (
    <div className="mt-30 min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Deliveries</h1>
            <p className="text-gray-600">Choose from available delivery opportunities</p>
          </div>
          <Link 
            to="/delivery/dashboard" 
            className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Available Deliveries List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">
              {availableDeliveries.length} Available Delivery{availableDeliveries.length !== 1 ? 'ies' : ''}
            </h2>
          </div>
          
          {availableDeliveries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FaTruck className="mx-auto text-4xl mb-4 opacity-50" />
              <p>No available deliveries at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {availableDeliveries.map(delivery => (
                <div key={delivery.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-lg">Order #{delivery.order.id}</h3>
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          {delivery.order.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{delivery.order.delivery_address}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <FaMoneyBillWave className="mr-2" />
                          <span>Delivery Fee: ${delivery.delivery_fee || '8.50'}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <FaClock className="mr-2" />
                          <span>Estimated Time: {delivery.estimated_time || '15-20 min'}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span>Distance: {delivery.distance || '2.3 km'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <button
                        onClick={() => acceptDelivery(delivery.id)}
                        className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center"
                      >
                        <FaCheckCircle className="mr-2" />
                        Accept Delivery
                      </button>
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

export default AvailableDeliveries;
