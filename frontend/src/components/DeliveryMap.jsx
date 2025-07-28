import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { debounce } from 'lodash';
import axios from '../api';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMarker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [geoError, setGeoError] = useState(null);

  const debouncedLocationSelect = useCallback(
    debounce((latlng) => {
      if (typeof latlng.lat === 'number' && typeof latlng.lng === 'number') {
        onLocationSelect({ lat: latlng.lat, lng: latlng.lng });
      }
    }, 300),
    [onLocationSelect]
  );

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      debouncedLocationSelect({ lat, lng });
      map.flyTo([lat, lng], map.getZoom());
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPosition = { lat: latitude, lng: longitude };
          setPosition(newPosition);
          onLocationSelect(newPosition);
          map.flyTo([latitude, longitude], 13);
          setGeoError(null);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setGeoError('Unable to access your location. Please select a location on the map.');
          // Fallback to Kibabii University coordinates
          const fallbackPosition = { lat: 0.62, lng: 34.52 };
          setPosition(fallbackPosition);
          onLocationSelect(fallbackPosition);
          map.flyTo([fallbackPosition.lat, fallbackPosition.lng], 15);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGeoError('Geolocation is not supported by your browser.');
      // Fallback to Kibabii University coordinates
      const fallbackPosition = { lat: 0.62, lng: 34.52 };
      setPosition(fallbackPosition);
      onLocationSelect(fallbackPosition);
      map.flyTo([fallbackPosition.lat, fallbackPosition.lng], 15);
    }
  }, [map, onLocationSelect]);

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
};

const DeliveryMap = ({ onLocationSelect, locations = [], selectedLocation, onLocationSelect: onSelect }) => {
  const defaultLocation = { lat: 0.62, lng: 34.52 }; // Kibabii University coordinates from kibabiiLocations.js

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[defaultLocation.lat, defaultLocation.lng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker onLocationSelect={onLocationSelect || onSelect} />
        
        {/* Display location markers */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.coordinates.lat, location.coordinates.lng]}
            eventHandlers={{
              click: () => onSelect && onSelect(location),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default DeliveryMap;