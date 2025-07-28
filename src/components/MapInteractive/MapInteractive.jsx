import { useState, useEffect } from 'react';
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
import { getAllBookmarks } from '../../service/apiService';

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
  const [formPosition, setFormPosition] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    selectedCategories,
    selectedTags,
    handleCategoryChange,
    handleTagChange,
    filterMarkers
  } = useMapFilters();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const bookmarksData = await getAllBookmarks();
        setMarkers(bookmarksData);
      } catch (err) {
        setError('Error al cargar los marcadores');
        console.error('Error fetching bookmarks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleMapClick = (position) => {
    if (user) {
      setFormPosition(position);
    }
  };

  const handleFormSubmit = async () => {
    setFormPosition(null);
    // Recargar los marcadores después de crear uno nuevo
    try {
      const bookmarksData = await getAllBookmarks();
      setMarkers(bookmarksData);
    } catch (err) {
      console.error('Error recargando marcadores:', err);
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
            categories={Array.from(new Set(markers.map(m => m.category))).map(c => ({ id: c, name: c }))}
            tags={Array.from(new Set(markers.map(m => m.tag))).map(t => ({ id: t, name: t }))}
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
            {filteredMarkers.map((marker) => (
              <Marker 
                key={marker.id} 
                position={[marker.location.latitude, marker.location.longitude]}
                icon={createCustomIcon(marker.category, marker.tag)}
              >
                <BookmarkPopup marker={marker} />
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {formPosition && (
          <MarkerForm
            position={formPosition}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    </div>
  );
}