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
import { useMapFilters } from '../../hooks/useMapFilters';
import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM } from '../../constants/mapConstants';
import { searchLocation } from '../../service/mapService';
import { getAllBookmarks } from '../../service/apiService';
import { useNavigate } from 'react-router-dom';

function MapClickHandler({ onClick, isPreview, showLoginPrompt }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useMapEvents({
    click(e) {
      if (isPreview) {
        navigate('/MapView');
      } else if (!user) {
        showLoginPrompt();
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
  height = '100%',
  initialCenter = null,
  initialZoom = null,
  focusedBookmarkId = null,
  isPreview = false
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formPosition, setFormPosition] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [temporaryMarker, setTemporaryMarker] = useState(null);
  const [isPositionConfirmed, setIsPositionConfirmed] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
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
        setLoading(true);
        setError(null);
        const bookmarksData = await getAllBookmarks();
        
        // Filtrar marcadores válidos con coordenadas
        const validBookmarks = bookmarksData.filter(bookmark => 
          bookmark.location && 
          bookmark.location.latitude && 
          bookmark.location.longitude
        );
        
        setMarkers(validBookmarks);
      } catch (err) {
        setError('Error al cargar los marcadores');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  useEffect(() => {
    if (focusedBookmarkId && markers.length > 0 && mapInstance) {
      const focusedMarker = markers.find(m => m.id === focusedBookmarkId);
      if (focusedMarker) {
        const markerLatLng = [focusedMarker.location.latitude, focusedMarker.location.longitude];
        
        const popupOffset = mapInstance.getSize().x * 0.15;
        const adjustedCenter = mapInstance.layerPointToLatLng(
          mapInstance.latLngToLayerPoint(markerLatLng).add([popupOffset, 0])
        );
        
        mapInstance.setView(adjustedCenter, 15, {
          animate: true,
          duration: 1
        });

        setTimeout(() => {
          const markerRef = markerRefs.current[focusedBookmarkId];
          if (markerRef) {
            markerRef.openPopup();
          }
        }, 100);
      }
    }
  }, [focusedBookmarkId, markers, mapInstance]);

  const handleMapClick = (position) => {
    if (!user) {
      return;
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
      const validBookmarks = bookmarksData.filter(bookmark => 
        bookmark.location && 
        bookmark.location.latitude && 
        bookmark.location.longitude
      );
      setMarkers(validBookmarks);
    } catch (err) {
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
    }
  };

  const filteredMarkers = filterMarkers(markers);

  const showLoginPrompt = () => {
    setShowLoginAlert(true);
    setTimeout(() => setShowLoginAlert(false), 3000);
  };

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
        {showLoginAlert && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] alert alert-info shadow-lg w-auto">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <span className="font-medium">Necesitas iniciar sesión para crear marcadores. </span>
                <button 
                  className="btn btn-link btn-sm pl-1 normal-case"
                  onClick={() => navigate('/login')}
                >
                  Iniciar sesión
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 z-0">
          {!user && !isPreview && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-base-100 p-4 rounded-lg shadow-lg text-center">
              <p className="text-sm mb-2">Para crear nuevos marcadores necesitas iniciar sesión</p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/login')}
              >
                Iniciar sesión
              </button>
            </div>
          )}
          
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
            <MapClickHandler 
              onClick={handleMapClick} 
              isPreview={isPreview} 
              showLoginPrompt={showLoginPrompt}
            />
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