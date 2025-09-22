import { useState } from 'react';

const AddMarkerControl = ({ 
  onAddMarker, 
  onAddMarkerAtLocation, 
  onAddMarkerAtClick,
  temporaryMarker 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      onAddMarker();
    }
  };

  const handleLocationClick = () => {
    setIsExpanded(false);
    if (temporaryMarker) {
      onAddMarkerAtLocation();
    }
  };

  const handleClickMode = () => {
    setIsExpanded(false);
    onAddMarkerAtClick();
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <button
        onClick={handleToggle}
        className="bg-secondary rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center w-12 h-12"
        title="Agregar marcador"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`text-white w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      {/* Panel expandido */}
      <div className={`absolute top-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[200px] transition-all duration-300 origin-top-right ${
        isExpanded 
          ? 'opacity-100 transform scale-100 translate-y-0' 
          : 'opacity-0 transform scale-95 -translate-y-4 pointer-events-none'
      }`}>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-2">Crear marcador</p>
          <button
            onClick={handleLocationClick}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            disabled={!temporaryMarker}
          >
            📍 En mi ubicación actual
          </button>
          <button
            onClick={handleClickMode}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            🗺️ Click en el mapa
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMarkerControl;
