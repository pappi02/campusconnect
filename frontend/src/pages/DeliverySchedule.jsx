import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaTruck, FaCheckCircle, FaTimesCircle, FaEdit, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CustomFooter from '../components/CustomFooter';
import api from '../api';

const DeliverySchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      const response = await api.get('/api/delivery/schedule/');
      
      // Separate slots into schedule and available
      const allSlots = response.data;
      const bookedSlots = allSlots.filter(slot => slot.status === 'booked' || slot.status === 'completed');
      const available = allSlots.filter(slot => slot.status === 'available');
      
      setSchedule(bookedSlots);
      setAvailableSlots(available);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setLoading(false);
    }
  };

  const handleAddSlot = async () => {
    try {
      await api.post('/api/delivery/schedule/', {
        ...newSlot,
        start_time: newSlot.startTime,
        end_time: newSlot.endTime
      });
      setShowAddModal(false);
      setNewSlot({ date: '', startTime: '', endTime: '', location: '', notes: '' });
      fetchScheduleData();
    } catch (err) {
      console.error('Error adding slot:', err);
    }
  };

  const handleUpdateSlot = async (id, updatedSlot) => {
    try {
      await api.put(`/api/delivery/schedule/${id}/`, updatedSlot);
      fetchScheduleData();
    } catch (err) {
      console.error('Error updating slot:', err);
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await api.delete(`/api/delivery/schedule/${id}/`);
      fetchScheduleData();
    } catch (err) {
      console.error('Error deleting slot:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'available': 'bg-green-100 text-green-800',
      'booked': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold text-gray-900">Delivery Schedule</h1>
            <p className="text-gray-600">Manage your delivery availability and schedule</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              to="/delivery/dashboard"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Slot
            </button>
          </div>
        </div>

        {/* Schedule Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaCalendarAlt className="text-blue-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Total Slots</p>
                <p className="text-2xl font-bold">{schedule.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold">{schedule.filter((s) => s.status === 'completed').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaClock className="text-yellow-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Available</p>
                <p className="text-2xl font-bold">{schedule.filter((s) => s.status === 'available').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaTruck className="text-purple-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Booked Slots</p>
                <p className="text-2xl font-bold">{schedule.filter((s) => s.status === 'booked').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Schedule */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Current Schedule</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedule.map((slot) => (
                  <tr key={slot.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(slot.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {slot.start_time} - {slot.end_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {slot.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(slot.status)}`}>
                        {slot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateSlot(slot.id, slot)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTimesCircle />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Slots */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Available Delivery Slots</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {availableSlots.map((slot) => (
              <div key={slot.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{new Date(slot.date).toLocaleDateString()}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(slot.status)}`}>
                    {slot.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <FaClock className="inline mr-1" />
                  {slot.start_time} - {slot.end_time}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <FaMapMarkerAlt className="inline mr-1" />
                  {slot.location}
                </p>
                <p className="text-sm text-gray-500">{slot.notes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Slot Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Add New Schedule Slot</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newSlot.location}
                    onChange={(e) => setNewSlot({...newSlot, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newSlot.notes}
                    onChange={(e) => setNewSlot({...newSlot, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSlot}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
                >
                  Add Slot
                </button>
              </div>
            </div>
          </div>
        )}

        <CustomFooter />
      </div>
    </div>
  );
};

export default DeliverySchedule;
