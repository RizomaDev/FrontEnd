import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = DefaultIcon;

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=';

const LocationAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const debounceTimeout = useRef();

  const fetchSuggestions = async (input) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${NOMINATIM_URL}${encodeURIComponent(input)}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSelect = (suggestion) => {
    setQuery(suggestion.display_name);
    setSuggestions([]);
    setSelectedLocation({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
      display_name: suggestion.display_name,
    });
    onSelect({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
      display_name: suggestion.display_name,
    });
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  function MapUpdater({ location }) {
    const map = useMap();
    useEffect(() => {
      if (location) {
        map.setView([location.lat, location.lon], 15);
      }
    }, [location, map]);
    return null;
  }

  return (
    <div className="location-autocomplete" style={{ position: "relative" }}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Buscar ubicación..."
        className="w-full px-3 py-2 text-sm md:text-base rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#004f59]"
      />
      {(isLoading || suggestions.length > 0) && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 9999,
          maxHeight: 200,
          overflowY: 'auto',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: 6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          {isLoading && (
            <div className="p-2 text-center text-gray-500">Buscando...</div>
          )}
          {!isLoading && suggestions.length > 0 && (
            <ul className="suggestions-list m-0 p-0">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  className="hover:bg-gray-100 cursor-pointer p-2"
                  style={{ listStyle: 'none' }}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="mt-4" style={{ height: '250px', width: '100%' }}>
        <MapContainer
          center={selectedLocation ? [selectedLocation.lat, selectedLocation.lon] : [40.4168, -3.7038]} // Default: Madrid
          zoom={selectedLocation ? 15 : 5}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {selectedLocation && (
            <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
              <Popup>{selectedLocation.display_name}</Popup>
            </Marker>
          )}
          <MapUpdater location={selectedLocation} />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationAutocomplete; 