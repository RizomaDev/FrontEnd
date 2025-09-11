import React, { useEffect, useRef, useState } from 'react';

const NOMINATIM_URL = 'https://corsproxy.io/?https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=';

const LocationSearchInput = ({ onSelect, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSelect = (suggestion) => {
    setQuery(suggestion.display_name);
    setSuggestions([]);
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

  return (
    <div className="location-search-input relative">
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
    </div>
  );
};

export default LocationSearchInput; 