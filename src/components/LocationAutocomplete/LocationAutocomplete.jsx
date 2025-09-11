import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createCustomIcon } from '../MapInteractive/CustomMarkerIcon';

const NOMINATIM_URL = 'https://corsproxy.io/?https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=';

const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await response.json();
    return {
      lat,
      lon,
      display_name: data.display_name || `${lat}, ${lon}`
    };
  } catch (error) {
    return {
      lat,
      lon,
      display_name: `${lat}, ${lon}`
    };
  }
};

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const location = await reverseGeocode(lat, lng);
      onLocationSelect(location);
    }
  });
  return null;
}

const LocationAutocomplete = ({ onSelect, showMap = true, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const debounceTimeout = useRef();

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

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

  const handleSelect = (location) => {
    setQuery(location.display_name);
    setSuggestions([]);
    setSelectedLocation({
      lat: parseFloat(location.lat),
      lon: parseFloat(location.lon),
      display_name: location.display_name,
    });
    onSelect({
      lat: parseFloat(location.lat),
      lon: parseFloat(location.lon),
      display_name: location.display_name,
    });
  };

  const handleMarkerDrag = async (e) => {
    const { lat, lng } = e.target.getLatLng();
    const location = await reverseGeocode(lat, lng);
    handleSelect(location);
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
        className="input input-bordered w-full"
      />
      {(isLoading || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 z-50 max-h-60 overflow-y-auto bg-base-100 rounded-lg shadow-lg mt-1">
          {isLoading && (
            <div className="p-3 text-center text-base-content/60">
              Buscando...
            </div>
          )}
          {!isLoading && suggestions.length > 0 && (
            <ul className="menu menu-compact p-0">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSelect(suggestion)}
                    className="py-2 px-4 hover:bg-base-200 text-left"
                  >
                    {suggestion.display_name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {showMap && (
        <div className="mt-4" style={{ height: '250px', width: '100%' }}>
          <MapContainer
            center={selectedLocation ? [selectedLocation.lat, selectedLocation.lon] : [40.4168, -3.7038]}
            zoom={selectedLocation ? 15 : 5}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <MapClickHandler onLocationSelect={handleSelect} />
            {selectedLocation && (
              <Marker 
                position={[selectedLocation.lat, selectedLocation.lon]}
                icon={createCustomIcon('temp', 'temp')}
                draggable={true}
                eventHandlers={{
                  dragend: handleMarkerDrag
                }}
              >
                <Popup>{selectedLocation.display_name}</Popup>
              </Marker>
            )}
            <MapUpdater location={selectedLocation} />
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete; 