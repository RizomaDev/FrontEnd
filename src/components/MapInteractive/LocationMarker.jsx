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
    // Crear el icono personalizado
    const locationIcon = L.divIcon({
      html: '<div class="location-marker"></div>',
      className: 'location-marker-container',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Activar la geolocalización
    map.locate({
      setView: false,
      maxZoom: 16,
      enableHighAccuracy: true,
      watch: false
    });

    // Manejador para cuando se encuentra la ubicación
    const handleLocationFound = (e) => {
      // Eliminar marcador anterior si existe
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Crear nuevo marcador
      const marker = L.marker(e.latlng, {
        icon: locationIcon,
        title: 'Tu ubicación'
      }).addTo(map);

      // Guardar referencia al marcador
      markerRef.current = marker;

      // Solo centrar el mapa si no venimos de un marcador específico
      if (!hasInitialState) {
        map.setView(e.latlng, 16);
      }
    };

    // Manejador de errores
    const handleLocationError = (e) => {
      console.error('Error de geolocalización:', e.message);
    };

    // Suscribirse a los eventos
    map.on('locationfound', handleLocationFound);
    map.on('locationerror', handleLocationError);

    // Limpieza al desmontar
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