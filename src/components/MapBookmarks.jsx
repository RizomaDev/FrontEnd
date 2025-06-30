import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Icono por defecto para los marcadores
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapBookmarks({ bookmarks, height = '500px', responsive = false }) {
  const defaultCenter = [36.7213, -4.4214];
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    const firstWithCoords = bookmarks.find(
      b => b.location && b.location.latitude && b.location.longitude
    );
    if (firstWithCoords) {
      setMapCenter([
        parseFloat(firstWithCoords.location.latitude),
        parseFloat(firstWithCoords.location.longitude)
      ]);
    }
  }, [bookmarks]);

  return (
    <div className={`w-full ${responsive ? 'h-full' : ''}`} style={!responsive ? { height } : {}}>
      <MapContainer 
        center={mapCenter}
        zoom={12}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <ZoomControl position="bottomright" />
        {bookmarks.filter(b => b.location && b.location.latitude && b.location.longitude).map((bookmark) => (
          <Marker
            key={bookmark.id}
            position={[parseFloat(bookmark.location.latitude), parseFloat(bookmark.location.longitude)]}
          >
            <Popup>
              <strong>{bookmark.title}</strong><br />
              <Link to={`/BookmarkDetails/${bookmark.id}`}>Ver detalles</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
