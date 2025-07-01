import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAllBookmarks } from '../../service/apiService';

// Importar los iconos predeterminados de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import MarkerForm from './Markerform';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function MapInteractive() {
  const [isClient, setIsClient] = useState(false);
  const [formPosition, setFormPosition] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const fetchBookmarks = async () => {
      try {
        const bookmarksData = await getAllBookmarks();
        // Filtrar solo los bookmarks que tienen ubicación
        const validBookmarks = bookmarksData.filter(bookmark => 
          bookmark.location && 
          bookmark.location.latitude && 
          bookmark.location.longitude
        );
        setMarkers(validBookmarks);
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
    setFormPosition(position);
  };

  const handleFormSubmit = (data) => {
    if (formPosition) {
      setMarkers([...markers, { 
        position: formPosition,
        title: data.title,
        description: data.description,
        tag: data.tag,
        imageFile: data.imageFile
      }]);
      setFormPosition(null);
    }
  };

  const handleFormCancel = () => {
    setFormPosition(null);
  };

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
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[36.7213, -4.4214]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onClick={handleMapClick} />
        {markers.map((marker, idx) => (
          <Marker 
            key={marker.id || idx} 
            position={[marker.location?.latitude || marker.position[0], marker.location?.longitude || marker.position[1]]}
          >
            <Popup>
              <div className="max-w-sm">
                <h3 className="font-bold text-lg">{marker.title}</h3>
                <p className="text-sm mt-2">{marker.description}</p>
                <div className="mt-2">
                  <span className="badge badge-secondary">{marker.category}</span>
                  <span className="badge badge-primary ml-2">{marker.tag}</span>
                </div>
                {(marker.imageUrls && marker.imageUrls.length > 0) ? (
                  <img
                    src={`http://localhost:8080/api/images/${marker.imageUrls[0].split('/').pop()}`}
                    alt={marker.title}
                    className="w-full h-32 object-cover mt-2 rounded"
                  />
                ) : marker.imageFile && (
                  <img
                    src={URL.createObjectURL(marker.imageFile)}
                    alt={marker.title}
                    className="w-full h-32 object-cover mt-2 rounded"
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <MarkerForm
        position={formPosition}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    </div>
  );
}