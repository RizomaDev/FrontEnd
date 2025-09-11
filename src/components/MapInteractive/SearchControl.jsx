import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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
    <div className={`${className} absolute top-4 left-4 z-[1002]`} ref={searchRef}>
      <div className="relative">
        {/* Floating Button */}
        <button
          onClick={toggleSearch}
          className={`
            bg-secondary rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300
            flex items-center justify-center w-12 h-12
            ${isExpanded ? 'rotate-180' : ''}
          `}
        >
          <FontAwesomeIcon icon={faSearch} className="text-white" />
        </button>

        {/* Search Panel */}
        <div className={`
          absolute top-16 left-0
          bg-white rounded-lg shadow-lg p-6
          transition-all duration-300 origin-top-left
          min-w-[280px]
          ${isExpanded 
            ? 'opacity-100 transform scale-100 translate-y-0' 
            : 'opacity-0 transform scale-95 -translate-y-4 pointer-events-none'}
        `}>
          <form onSubmit={handleSubmit} className="relative">
            <div className="form-control">
              <h3 className="text-gray-700 font-medium mb-2">Buscar ubicación</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleInputChange}
                  placeholder="🗺️ Buscar en el mapa..."
                  className="input input-bordered w-full"
                />
              </div>
            </div>
            
            {(isLoading || suggestions.length > 0) && (
              <div className="mt-2 bg-base-100 rounded-lg shadow overflow-hidden">
                {isLoading && (
                  <div className="p-2 text-center text-gray-500">Buscando lugares...</div>
                )}
                {!isLoading && suggestions.length > 0 && (
                  <ul className="max-h-60 overflow-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelect(suggestion)}
                        className="p-2 hover:bg-secondary/10 cursor-pointer flex items-center gap-2"
                      >
                        <span className="text-secondary">📍</span>
                        <span className="text-sm">{suggestion.display_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchControl; 