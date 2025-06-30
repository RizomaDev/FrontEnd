import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMapClick = (position) => {
    setFormPosition(position);
  };

  const handleFormSubmit = (data) => {
    if (formPosition) {
      setMarkers([...markers, { position: formPosition, ...data }]);
      setFormPosition(null);
    }
  };

  const handleFormCancel = () => {
    setFormPosition(null);
  };

  if (!isClient) return null;

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
          <Marker key={idx} position={marker.position}>
            <Popup>
              <strong>{marker.title}</strong>
              <p>{marker.description}</p>
              <small>{marker.tag}</small>
              {marker.imageFile && (
                <img
                  src={URL.createObjectURL(marker.imageFile)}
                  alt={marker.title}
                  style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '1rem' }}
                />
              )}
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