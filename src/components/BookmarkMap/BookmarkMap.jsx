import React from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createCustomIcon } from '../MapInteractive/CustomMarkerIcon';
import BookmarkPopup from '../MapInteractive/BookmarkPopup';

// Componente para centralizar o mapa no marcador
function CenterMarker({ location }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 15);
    }
  }, [map, location]);

  return null;
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
          <BookmarkPopup marker={bookmark} />
        </Marker>
      </MapContainer>
    </div>
  );
} 