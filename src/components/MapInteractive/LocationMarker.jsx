import { useEffect, useRef } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from 'react-router-dom';

const LocationMarker = () => {
  const map = useMap();
  const markerRef = useRef(null);
  const location = useLocation();
  const hasInitialState = location.state?.center && location.state?.focusedBookmarkId;

  useEffect(() => {
    const locationIcon = L.divIcon({
      html: '<div class="location-marker"></div>',
      className: 'location-marker-container',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    map.locate({
      setView: false,
      maxZoom: 16,
      enableHighAccuracy: true,
      watch: false
    });

    const handleLocationFound = (e) => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      const marker = L.marker(e.latlng, {
        icon: locationIcon,
        title: 'Tu ubicación'
      }).addTo(map);

      markerRef.current = marker;
      if (!hasInitialState) {
        map.setView(e.latlng, 16);
      }
    };

    const handleLocationError = (e) => {
    };

    map.on('locationfound', handleLocationFound);
    map.on('locationerror', handleLocationError);

    return () => {
      map.off('locationfound', handleLocationFound);
      map.off('locationerror', handleLocationError);
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, hasInitialState]);

  return null;
};

export default LocationMarker; 