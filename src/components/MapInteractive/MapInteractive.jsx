import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../context/AuthContext';
import HeaderLogged from '../HeaderLogged/HeaderLogged';
import Header from '../Header/Header';
import BookmarkPopup from './BookmarkPopup';
import LocationMarker from './LocationMarker';
import SearchControl from './SearchControl';
import MapFilters from '../MapFilters';
import MarkerForm from './Markerform';
import { createCustomIcon } from './CustomMarkerIcon';
import { useMapMarkers } from '../../hooks/useMapMarkers';
import { useMapFilters } from '../../hooks/useMapFilters';
import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM } from '../../constants/mapConstants';
import { searchLocation } from '../../service/mapService';

function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function MapInteractive() {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [formPosition, setFormPosition] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  const {
    markers,
    loading,
    error,
    categories,
    tags,
    addMarker
  } = useMapMarkers();

  const {
    selectedCategories,
    selectedTags,
    handleCategoryChange,
    handleTagChange,
    filterMarkers
  } = useMapFilters();

  useState(() => {
    setIsClient(true);
  }, []);

  const handleMapClick = (position) => {
    if (user) {
      setFormPosition(position);
    }
  };

  const handleFormSubmit = (data) => {
    if (formPosition && user) {
      addMarker(formPosition, data);
      setFormPosition(null);
    }
  };

  const handleFormCancel = () => {
    setFormPosition(null);
  };

  const handleSearch = async (searchValue) => {
    try {
      const coordinates = await searchLocation(searchValue);
      if (coordinates && mapInstance) {
        mapInstance.setView([coordinates.lat, coordinates.lon], 16);
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    }
  };

  const filteredMarkers = filterMarkers(markers);

  if (!isClient) return null;

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-error">
      {error}
    </div>;
  }

  return (
    <div className="flex flex-col h-screen relative">
      <div className="z-[1003]">
        {user ? <HeaderLogged /> : <Header />}
      </div>
      
      <div className="flex-grow relative">
        <div className="absolute inset-0 z-[900]">
          <SearchControl onSearch={handleSearch} />
          <MapFilters
            categories={categories}
            tags={tags}
            selectedCategories={selectedCategories}
            selectedTags={selectedTags}
            onCategoryChange={handleCategoryChange}
            onTagChange={handleTagChange}
          />
          <MapContainer
            center={DEFAULT_MAP_CENTER}
            zoom={DEFAULT_ZOOM}
            style={{ height: '100%', width: '100%' }}
            ref={setMapInstance}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <LocationMarker />
            <MapClickHandler onClick={handleMapClick} />
            {filteredMarkers.map((marker, idx) => (
              <Marker 
                key={marker.id || idx} 
                position={[marker.location?.latitude || marker.position[0], marker.location?.longitude || marker.position[1]]}
                icon={createCustomIcon(marker.category, marker.tag)}
              >
                <BookmarkPopup marker={marker} />
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {user && formPosition && (
          <div className="absolute inset-0 z-[901]">
            <MarkerForm
              position={formPosition}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
}