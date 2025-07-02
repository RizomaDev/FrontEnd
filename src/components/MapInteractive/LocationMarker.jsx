import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const LocationMarker = () => {
  const map = useMap();
  const markerRef = useRef(null);
  const initialSetViewRef = useRef(true);

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
      console.log('Ubicación encontrada:', e.latlng);
      
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

      // Solo centrar el mapa en la primera ubicación encontrada
      if (initialSetViewRef.current) {
        map.setView(e.latlng, 16);
        initialSetViewRef.current = false;
      }
    };

    // Manejador de errores
    const handleLocationError = (e) => {
      console.error('Error de geolocalización:', e.message);
      alert('No se pudo obtener tu ubicación. Por favor, verifica que has dado los permisos necesarios.');
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
  }, [map]);

  return null;
};

export default LocationMarker; 