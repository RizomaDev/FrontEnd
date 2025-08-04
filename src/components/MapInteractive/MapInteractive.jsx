import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl, Popup } from 'react-leaflet';
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
import { useNavigate } from 'react-router-dom';

function MapClickHandler({ onClick, isPreview }) {
  const navigate = useNavigate();
  useMapEvents({
    click(e) {
      if (isPreview) {
        navigate('/MapView');
      } else {
        onClick([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
}

export default function MapInteractive({ 
  showHeader = true, 
  showFilters = true,
  focusedMarker = null,
  height = '100%',
  customComponents = null,
  onMapInstance = null,
  initialCenter = null,
  initialZoom = null,
  focusedBookmarkId = null,
  isPreview = false
}) {
  const { user } = useAuth();
  const [formPosition, setFormPosition] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [temporaryMarker, setTemporaryMarker] = useState(null);
  const [isPositionConfirmed, setIsPositionConfirmed] = useState(false);
  const markerRefs = useRef({});

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

  // Efecto para manejar el marcador enfocado
  useEffect(() => {
    if (focusedBookmarkId && markers.length > 0 && mapInstance) {
      const focusedMarker = markers.find(m => m.id === focusedBookmarkId);
      if (focusedMarker) {
        // Centrar el mapa en el marcador
        mapInstance.setView(
          [focusedMarker.location.latitude, focusedMarker.location.longitude],
          15
        );
        
        // Abrir el popup del marcador correspondiente
        const markerRef = markerRefs.current[focusedBookmarkId];
        if (markerRef) {
          setTimeout(() => {
            markerRef.openPopup();
          }, 100);
        }
      }
    }
  }, [focusedBookmarkId, markers, mapInstance]);

  const handleMapClick = (position) => {
    if (!user) {
      return; // Solo ignoramos el click si no hay usuario
    }
    setTemporaryMarker(position);
    setIsPositionConfirmed(false);
  };

  const handleMarkerDrag = (e) => {
    const newPosition = [e.target.getLatLng().lat, e.target.getLatLng().lng];
    setTemporaryMarker(newPosition);
    setIsPositionConfirmed(false);
  };

  const handlePositionConfirm = () => {
    setFormPosition(temporaryMarker);
    setIsPositionConfirmed(true);
  };

  const handleFormSubmit = async () => {
    setFormPosition(null);
    setTemporaryMarker(null);
    setIsPositionConfirmed(false);
    try {
      const bookmarksData = await getAllBookmarks();
      setMarkers(bookmarksData);
    } catch (err) {
      console.error('Error recargando marcadores:', err);
    }
  };

  const handleFormCancel = () => {
    setFormPosition(null);
    setTemporaryMarker(null);
    setIsPositionConfirmed(false);
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
      {showHeader && (
        <div className="z-50">
          {user ? <HeaderLogged /> : <Header />}
        </div>
      )}
      
      <div className="flex-grow relative">
        <div className="absolute inset-0 z-0">
          {showFilters && (
            <>
              <SearchControl onSearch={handleSearch} />
              <MapFilters
                categories={Array.from(new Set(markers.map(m => m.category))).map(c => ({ id: c, name: c }))}
                tags={Array.from(new Set(markers.map(m => m.tag))).map(t => ({ id: t, name: t }))}
                selectedCategories={selectedCategories}
                selectedTags={selectedTags}
                onCategoryChange={handleCategoryChange}
                onTagChange={handleTagChange}
              />
            </>
          )}
          <MapContainer
            center={initialCenter || DEFAULT_MAP_CENTER}
            zoom={initialZoom || DEFAULT_ZOOM}
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
            <MapClickHandler onClick={handleMapClick} isPreview={isPreview} />
            {temporaryMarker && !isPositionConfirmed && (
              <Marker
                position={temporaryMarker}
                icon={createCustomIcon('temp', 'temp')}
                draggable={true}
                eventHandlers={{
                  dragend: handleMarkerDrag
                }}
              >
                <Popup closeButton={false}>
                  <div className="flex flex-col items-center gap-2 p-2">
                    <p className="text-sm">Arrastra el marcador para ajustar la posición</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePositionConfirm();
                      }}
                      className="btn btn-primary btn-sm normal-case"
                    >
                      Confirmar ubicación
                    </button>
                  </div>
                </Popup>
              </Marker>
            )}
            {filteredMarkers.map((marker) => (
              <Marker 
                key={marker.id} 
                position={[marker.location.latitude, marker.location.longitude]}
                icon={createCustomIcon(marker.category, marker.tag)}
                ref={(ref) => {
                  if (ref) {
                    markerRefs.current[marker.id] = ref;
                  }
                }}
              >
                <BookmarkPopup marker={marker} />
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {isPositionConfirmed && formPosition && (
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