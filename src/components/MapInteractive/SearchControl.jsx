import { useState } from 'react';

const SearchControl = ({ className = '', onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <div className={`search-control ${className} absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg`}>
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar ubicación..."
          className="px-4 py-2 rounded-l-lg border-r border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button 
          type="submit" 
          className="px-4 py-2 bg-primary text-white rounded-r-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary"
        >
          🔍
        </button>
      </form>
    </div>
  );
};

export default SearchControl; 