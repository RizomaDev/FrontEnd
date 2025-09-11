import React from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { createCustomIcon } from '../MapInteractive/CustomMarkerIcon';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../constants/mapConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faLink } from '@fortawesome/free-solid-svg-icons';

function CenterMarker({ location }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 15);
    }
  }, [map, location]);

  return null;
}

function DetailedBookmarkPopup({ marker }) {
  const navigate = useNavigate();
  const categoryLower = marker.category ? marker.category.toLowerCase() : '';
  const backgroundColor = CATEGORY_COLORS[categoryLower] || DEFAULT_CATEGORY_COLOR;
  

  const getButtonClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'conflictos':
        return 'btn-primary';
      case 'propuestas':
        return 'btn-success';
      case 'iniciativas':
        return 'btn-warning';
      default:
        return 'btn-neutral';
    }
  };

  const handleViewInMap = () => {
    navigate('/MapView', {
      state: {
        center: [marker.location.latitude, marker.location.longitude],
        zoom: 15,
        focusedBookmarkId: marker.id
      }
    });
  };

  return (
    <Popup>
      <div className="max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div>
            <span 
              className="badge"
              style={{ 
                backgroundColor: backgroundColor,
                color: 'white',
                border: 'none'
              }}
            >
              {marker.category}
            </span>
            <span 
              className="badge ml-2"
              style={{ 
                backgroundColor: 'oklch(0.7036 0.0814 186.26)', 
                color: 'white',
                border: 'none'
              }}
            >
              {marker.tag}
            </span>
          </div>
        </div>
        <h3 className="font-bold text-lg">{marker.title}</h3>
        <p className="text-sm mt-2">{marker.description}</p>
        
        {marker.videoUrl && (
          <div className="mt-2">
            <a 
              href={marker.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary-focus flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faVideo} />
              Ver video
            </a>
          </div>
        )}

        {marker.infoAdicional && (
          <div className="mt-2">
            <a 
              href={marker.infoAdicional}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary-focus flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faLink} />
              Más información
            </a>
          </div>
        )}
       
        {marker.imageUrls && marker.imageUrls.length > 0 && (
          <div className="mt-2">
            <img
              src={marker.imageUrls[0]}
              alt={marker.title}
              className="w-full h-32 object-cover rounded"
            />
            {marker.imageUrls.length > 1 && (
              <p className="text-xs text-gray-500 mt-1 text-center">
                +{marker.imageUrls.length - 1} imagen{marker.imageUrls.length - 1 > 1 ? 'es' : ''} más
              </p>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleViewInMap}
            className={`btn ${getButtonClass(marker.category)} btn-sm text-white`}
          >
            Ver en el mapa
          </button>
        </div>
      </div>
    </Popup>
  );
}

export default function BookmarkMap({ bookmark }) {
  if (!bookmark?.location) return null;

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[bookmark.location.latitude, bookmark.location.longitude]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <CenterMarker location={bookmark.location} />
        <Marker 
          position={[bookmark.location.latitude, bookmark.location.longitude]}
          icon={createCustomIcon(bookmark.category, bookmark.tag)}
        >
          <DetailedBookmarkPopup marker={bookmark} />
        </Marker>
      </MapContainer>
    </div>
  );
} 