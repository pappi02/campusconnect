import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTruck, FaBell, FaShieldAlt, FaCreditCard, FaSave, FaEdit, FaCamera } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CustomFooter from '../components/CustomFooter';
import api from '../api';

const DeliverySettings = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    vehicleType: '',
    licenseNumber: '',
    bankAccount: '',
    notifications: {
      newOrders: true,
      scheduleReminders: true,
      earningsUpdates: true,
      ratingAlerts: true
    },
    preferences: {
      autoAccept: false,
      maxDistance: 10,
      preferredAreas: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/api/delivery/settings/');
      const profileData = response.data;
      setProfile({
        name: profileData.user_name,
        email: profileData.user_email,
        phone: profileData.user_phone,
        address: profileData.address || '',
        vehicleType: profileData.vehicle_type,
        licenseNumber: profileData.license_number,
        bankAccount: profileData.bank_account,
        profileImage: profileData.profile_image,
        notifications: {
          newOrders: profileData.notify_new_orders,
          scheduleReminders: profileData.notify_schedule_reminders,
          earningsUpdates: profileData.notify_earnings_updates,
          ratingAlerts: profileData.notify_rating_alerts,
        },
        preferences: {
          autoAccept: profileData.auto_accept_orders,
          maxDistance: profileData.max_delivery_distance,
          preferredAreas: profileData.preferred_areas ? profileData.preferred_areas.split(',') : [],
        },
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const profileDataToSave = {
        vehicle_type: profile.vehicleType,
        license_number: profile.licenseNumber,
        bank_account: profile.bankAccount,
        notify_new_orders: profile.notifications.newOrders,
        notify_schedule_reminders: profile.notifications.scheduleReminders,
        notify_earnings_updates: profile.notifications.earningsUpdates,
        notify_rating_alerts: profile.notifications.ratingAlerts,
        auto_accept_orders: profile.preferences.autoAccept,
        max_delivery_distance: profile.preferences.maxDistance,
        preferred_areas: profile.preferences.preferredAreas.join(','),
      };
      
      await api.put('/api/delivery/settings/', profileDataToSave);
      setEditing(false);
      setSaving(false);
    } catch (err) {
      console.error('Error saving settings:', err);
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (key, value) => {
    setProfile(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      const response = await api.post('/api/delivery/upload-profile-image/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, profileImage: response.data.image_url }));
    } catch (err) {
      console.error('Error uploading image:', err);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Delivery Settings</h1>
            <p className="text-gray-600">Manage your profile, preferences, and account settings</p>
          </div>
          <Link
            to="/delivery/dashboard"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition mt-4 md:mt-0"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="text-yellow-600 hover:text-yellow-700 flex items-center"
            >
              <FaEdit className="mr-2" />
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="relative">
                <img
                  src={profile.profileImage || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23f3f4f6"/%3E%3Ctext x="50" y="55" font-family="Arial" font-size="12" fill="%236b7280" text-anchor="middle" dominant-baseline="middle"%3EProfile%3C/text%3E%3C/svg%3E'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                {editing && (
                  <label className="absolute bottom-0 right-0 bg-yellow-500 text-black rounded-full p-2 cursor-pointer">
                    <FaCamera className="text-sm" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                <select
                  value={profile.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
                >
                  <option value="">Select Vehicle</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="car">Car</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="truck">Truck</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                <input
                  type="text"
                  value={profile.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            {editing && (
              <div className="mt-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Payment & Banking</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account Number</label>
                <input
                  type="text"
                  value={profile.bankAccount}
                  onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={profile.paymentMethod || 'bank'}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="mobile">Mobile Money</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Notification Preferences</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(profile.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {key === 'newOrders' && 'New Delivery Orders'}
                      {key === 'scheduleReminders' && 'Schedule Reminders'}
                      {key === 'earningsUpdates' && 'Earnings Updates'}
                      {key === 'ratingAlerts' && 'Rating Alerts'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {key === 'newOrders' && 'Get notified when new orders are available'}
                      {key === 'scheduleReminders' && 'Receive reminders for upcoming deliveries'}
                      {key === 'earningsUpdates' && 'Get daily/weekly earnings summaries'}
                      {key === 'ratingAlerts' && 'Get notified about new customer ratings'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleNotificationChange(key, e.target.checked)}
                      disabled={!editing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Preferences */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Delivery Preferences</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-accept Orders</p>
                  <p className="text-sm text-gray-600">Automatically accept orders within your preferences</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.preferences.autoAccept}
                    onChange={(e) => handlePreferenceChange('autoAccept', e.target.checked)}
                    disabled={!editing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Delivery Distance (km)
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={profile.preferences.maxDistance}
                  onChange={(e) => handlePreferenceChange('maxDistance', parseInt(e.target.value))}
                  disabled={!editing}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>1 km</span>
                  <span className="font-bold text-yellow-600">{profile.preferences.maxDistance} km</span>
                  <span>50 km</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Delivery Areas
                </label>
                <textarea
                  value={profile.preferences.preferredAreas.join(', ')}
                  onChange={(e) => handlePreferenceChange('preferredAreas', e.target.value.split(',').map(s => s.trim()))}
                  disabled={!editing}
                  placeholder="Enter areas separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Security Settings</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <button className="w-full md:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                Change Password
              </button>
              <button className="w-full md:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                Enable Two-Factor Authentication
              </button>
              <button className="w-full md:w-auto px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <CustomFooter />
    </div>
  );
};

export default DeliverySettings;
