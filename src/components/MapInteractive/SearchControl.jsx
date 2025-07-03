import { useState, useRef, useEffect } from 'react';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search?format=json&q=';

const SearchControl = ({ className = '', onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const debounceTimeout = useRef(null);
  const searchRef = useRef(null);

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
    setSearchValue(value);
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSelect = (suggestion) => {
    setSearchValue(suggestion.display_name);
    setSuggestions([]);
    onSearch(suggestion.display_name);
    setIsExpanded(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
      setIsExpanded(false);
    }
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        searchRef.current?.querySelector('input')?.focus();
      }, 100);
    }
  };

  return (
    <div className={`${className} absolute right-4 top-20 z-[9999]`} ref={searchRef}>
      {!isExpanded ? (
        <button
          onClick={toggleSearch}
          className="btn btn-circle btn-primary"
          title="Buscar en el mapa"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              stroke="currentColor"
              fill="none"
              d="M12 21c-.6 0-1-.4-1-1v-1.1c-3.3-.5-5.9-3.1-6.4-6.4H3.5c-.6 0-1-.4-1-1s.4-1 1-1h1.1c.5-3.3 3.1-5.9 6.4-6.4V3c0-.6.4-1 1-1s1 .4 1 1v1.1c3.3.5 5.9 3.1 6.4 6.4h1.1c.6 0 1 .4 1 1s-.4 1-1 1h-1.1c-.5 3.3-3.1 5.9-6.4 6.4V20c0 .6-.4 1-1 1zm0-4c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5z"
            />
          </svg>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="relative">
          <label className="input input-bordered join-item flex items-center gap-2 bg-base-100 w-72">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 opacity-50" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                stroke="currentColor"
                fill="none"
                d="M12 21c-.6 0-1-.4-1-1v-1.1c-3.3-.5-5.9-3.1-6.4-6.4H3.5c-.6 0-1-.4-1-1s.4-1 1-1h1.1c.5-3.3 3.1-5.9 6.4-6.4V3c0-.6.4-1 1-1s1 .4 1 1v1.1c3.3.5 5.9 3.1 6.4 6.4h1.1c.6 0 1 .4 1 1s-.4 1-1 1h-1.1c-.5 3.3-3.1 5.9-6.4 6.4V20c0 .6-.4 1-1 1zm0-4c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5z"
              />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              placeholder="🗺️ Buscar en el mapa..."
              className="grow"
            />
            <button 
              type="button" 
              className="btn btn-ghost btn-sm"
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </button>
          </label>
          
          {(isLoading || suggestions.length > 0) && (
            <div className="absolute top-full right-0 mt-1 bg-base-100 rounded-lg shadow-lg overflow-hidden w-72">
              {isLoading && (
                <div className="p-2 text-center text-gray-500">Buscando lugares...</div>
              )}
              {!isLoading && suggestions.length > 0 && (
                <ul className="max-h-60 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelect(suggestion)}
                      className="p-2 hover:bg-base-200 cursor-pointer"
                    >
                      📍 {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default SearchControl; 