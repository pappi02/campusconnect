import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Clock, DollarSign, Package, User, Search } from 'lucide-react';
import DeliveryMap from '../components/DeliveryMap';
import { useAuth } from '../contexts/useAuth';
import '../components/map.css';

const CustomerMapPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [nearbyStores, setNearbyStores] = useState([]);

  // Mock data for customer-facing stores and locations
  const mockCustomerLocations = [
    {
      id: 1,
      name: "Maseno University Main Campus",
      type: "University",
      address: "Maseno, Kisumu",
      coordinates: { lat: -0.0048, lng: 34.6012 },
      description: "Main campus with various shops and services",
      phone: "+254 712 345 678",
      website: "www.maseno.ac.ke",
      hours: "8:00 AM - 5:00 PM",
      rating: 4.5,
      image: "https://via.placeholder.com/300x200?text=Maseno+University"
    },
    {
      id: 2,
      name: "Maseno Town Market",
      type: "Market",
      address: "Maseno Town Center",
      coordinates: { lat: -0.0035, lng: 34.6008 },
      description: "Local market with fresh produce and goods",
      phone: "+254 723 456 789",
      hours: "6:00 AM - 6:00 PM",
      rating: 4.2,
      image: "https://via.placeholder.com/300x200?text=Maseno+Market"
    },
    {
      id: 3,
      name: "Student Center Complex",
      type: "Shopping Center",
      address: "Maseno University",
      coordinates: { lat: -0.0052, lng: 34.6015 },
      description: "Shopping complex with various shops and services",
      phone: "+254 734 567 890",
      hours: "8:00 AM - 8:00 PM",
      rating: 4.0,
      image: "https://via.placeholder.com/300x200?text=Student+Center"
    }
  ];

  const filteredLocations = mockCustomerLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Map</h1>
              <p className="text-sm text-gray-600">Find stores and locations near you</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Interactive Customer Map</h2>
                <p className="text-sm text-gray-600">Find stores and locations near you</p>
              </div>
              <div className="h-96">
                <DeliveryMap 
                  locations={filteredLocations}
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Search Locations</h3>
              <input
                type="text"
                placeholder="Search stores or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location List */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Nearby Locations</h3>
              <div className="space-y-3">
                {filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{location.name}</h4>
                        <p className="text-sm text-gray-600">{location.type}</p>
                        <p className="text-sm text-gray-500">{location.address}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-yellow-600">★ {location.rating}</span>
                          <span className="text-sm text-gray-500">{location.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Location Details */}
            {selectedLocation && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-md font-semibold text-gray-900 mb-3">Location Details</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedLocation.name}</h4>
                    <p className="text-sm text-gray-600">{selectedLocation.type}</p>
                    <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                    <p className="text-sm text-gray-600">{selectedLocation.phone}</p>
                    <p className="text-sm text-gray-600">{selectedLocation.hours}</p>
                    <p className="text-sm text-gray-600">{selectedLocation.description}</p>
                  </div>
                  <Link
                    to={`/store/${selectedLocation.id}`}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    View Store Details
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerMapPage;
