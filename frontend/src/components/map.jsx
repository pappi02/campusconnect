import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for default marker icon issue in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to handle map click events and marker placement
function LocationMarker({ setLocation, position, setPosition, mapRef }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(e.latlng);
    },
  });

  useEffect(() => {
    if (position && mapRef.current) {
      mapRef.current.flyTo([position.lat, position.lng], 15, { duration: 1 });
    }
  }, [position, mapRef]);

  return position ? <Marker position={position} /> : null;
}

// Main Map component with location permission handling
export default function MapWithLocation({ setLocation }) {
  const kibabiiUniversity = [0.62, 34.52]; // Kibabii University coordinates
  const [position, setPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt', 'granted', 'denied', 'unsupported'
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingGeocode, setIsLoadingGeocode] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjgyMTE2OTg1ZmE0MzRjYmQ4M2E1MDQ5ZDI3NzcyMTE0IiwiaCI6Im11cm11cjY0In0=';

  // Check if geolocation is supported
  useEffect(() => {
    if (!navigator.geolocation) {
      setPermissionStatus('unsupported');
    }
  }, []);

  // Request user location
  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setPermissionStatus('unsupported');
      return;
    }

    setIsLoadingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const userPos = { lat: latitude, lng: longitude };
        setUserLocation(userPos);
        setPosition(userPos);
        setLocation(userPos);
        setPermissionStatus('granted');
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setPermissionStatus('denied');
        setIsLoadingLocation(false);
        setError('Unable to access your location. Please select manually.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Automatically request location on mount
  useEffect(() => {
    if (navigator.geolocation && permissionStatus === 'prompt') {
      requestUserLocation();
    } else if (!navigator.geolocation) {
      setPermissionStatus('unsupported');
    }
  }, [permissionStatus]);

  // Fetch address via reverse geocoding
  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) {
        setAddress('');
        return;
      }

      setIsLoadingGeocode(true);
      setError(null);

      try {
        const response = await axios.get('https://api.openrouteservice.org/geocode/reverse', {
          params: {
            api_key: ORS_API_KEY,
            'point.lon': position.lng,
            'point.lat': position.lat,
            size: 1,
          },
        });
        const features = response.data.features;
        setAddress(features.length > 0 ? features[0].properties.label : 'Address not found');
      } catch (error) {
        console.error('Error fetching address:', error);
        setAddress('Error fetching address');
        setError('Failed to fetch address. Please try again.');
      } finally {
        setIsLoadingGeocode(false);
      }
    };

    fetchAddress();
  }, [position, ORS_API_KEY]);

  // Handle location name submission (geocoding)
  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    if (!locationName.trim()) {
      setError('Please enter a location name or landmark.');
      return;
    }

    setIsLoadingGeocode(true);
    setError(null);

    try {
      const response = await axios.get('https://api.openrouteservice.org/geocode/search', {
        params: {
          api_key: ORS_API_KEY,
          text: locationName,
          'boundary.rect.min_lon': 34.7,
          'boundary.rect.min_lat': -0.35,
          'boundary.rect.max_lon': 34.85,
          'boundary.rect.max_lat': -0.2,
          size: 1,
        },
      });

      const features = response.data.features;
      if (features.length > 0) {
        const { coordinates } = features[0].geometry;
        const newPosition = { lat: coordinates[1], lng: coordinates[0] };
        setPosition(newPosition);
        setLocation(newPosition);
        setUserLocation(null); // Clear user location
      } else {
        setError('No location found. Try another name or click the map.');
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
      setError('Error finding location. Please try again.');
    } finally {
      setIsLoadingGeocode(false);
    }
  };

  // Reset location
  const handleResetLocation = () => {
    setPosition(null);
    setUserLocation(null);
    setLocation(null);
    setAddress('');
    setLocationName('');
    setError(null);
    if (mapRef.current) {
      mapRef.current.flyTo(kibabiiUniversity, 15, { duration: 1 });
    }
  };

  return (
    <div className="space-y-4 w-full h-full">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Permission Dialog */}
      {permissionStatus === 'prompt' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Use Your Location</h3>
          <p className="text-blue-700 mb-4">
            Allow access to your location to set your delivery address automatically?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={requestUserLocation}
              disabled={isLoadingLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
            >
              {isLoadingLocation ? 'Locating...' : 'Allow'}
            </button>
            <button
              onClick={() => setPermissionStatus('denied')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Deny
            </button>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {permissionStatus === 'denied' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-yellow-800">
            Location access denied. Select your location manually by clicking the map or entering an address.
          </p>
        </div>
      )}
      {permissionStatus === 'unsupported' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <p className="text-gray-700">
            Geolocation is not supported. Please select your location manually.
          </p>
        </div>
      )}

      {/* Map */}
      <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={position ? [position.lat, position.lng] : kibabiiUniversity}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          className="leaflet-container"
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker
            setLocation={setLocation}
            position={position}
            setPosition={setPosition}
            mapRef={mapRef}
          />
        </MapContainer>
      </div>

      {/* Manual Location Controls */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Set Your Location</h2>
          {permissionStatus === 'granted' && (
            <span className="text-sm text-green-600">✓ Using your current location</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="e.g., Kibabii University Library"
            className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLocationSubmit}
            disabled={isLoadingGeocode}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
          >
            {isLoadingGeocode ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="flex space-x-4">
          {permissionStatus !== 'granted' && (
            <button
              onClick={requestUserLocation}
              disabled={isLoadingLocation}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition duration-200"
            >
              {isLoadingLocation ? 'Locating...' : 'Use Current Location'}
            </button>
          )}
          {position && (
            <button
              onClick={handleResetLocation}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
            >
              Reset Location
            </button>
          )}
        </div>
      </div>

      {/* Display Selected Location */}
      {position && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold text-gray-800">Selected Location:</p>
          <p className="text-gray-600">Latitude: {position.lat.toFixed(6)}</p>
          <p className="text-gray-600">Longitude: {position.lng.toFixed(6)}</p>
          <p className="text-gray-600">
            Address: {isLoadingGeocode ? 'Fetching address...' : address}
          </p>
        </div>
      )}
    </div>
  );
}

