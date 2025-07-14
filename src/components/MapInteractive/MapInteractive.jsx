import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAllBookmarks } from '../../service/apiService';
import { useAuth } from '../../context/AuthContext';
import HeaderLogged from '../HeaderLogged/HeaderLogged';
import Header from '../Header/Header';
import BookmarkPopup from './BookmarkPopup';
import LocationMarker from './LocationMarker';
import SearchControl from './SearchControl';
import MapFilters from '../MapFilters';

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
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [formPosition, setFormPosition] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  // Estados para los filtros
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

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

        // Extraer categorías y tags únicos de los bookmarks
        const uniqueCategories = Array.from(new Set(validBookmarks.map(bookmark => bookmark.category)))
          .filter(category => category)
          .map(category => ({ id: category, name: category }));
        
        const uniqueTags = Array.from(new Set(validBookmarks.map(bookmark => bookmark.tag)))
          .filter(tag => tag)
          .map(tag => ({ id: tag, name: tag }));

        setCategories(uniqueCategories);
        setTags(uniqueTags);
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
    if (user) {
      setFormPosition(position);
    }
  };

  const handleFormSubmit = (data) => {
    if (formPosition && user) {
      const newMarker = { 
        position: formPosition,
        title: data.title,
        description: data.description,
        tag: data.tag,
        category: data.category,
        imageFile: data.imageFile
      };
      setMarkers([...markers, newMarker]);

      // Actualizar categorías y tags si son nuevos
      if (data.category && !categories.find(c => c.name === data.category)) {
        setCategories([...categories, { id: data.category, name: data.category }]);
      }
      if (data.tag && !tags.find(t => t.name === data.tag)) {
        setTags([...tags, { id: data.tag, name: data.tag }]);
      }

      setFormPosition(null);
    }
  };

  const handleFormCancel = () => {
    setFormPosition(null);
  };

  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;
    const newSelectedCategories = new Set(selectedCategories);
    
    if (categoryName === "") {
      // Si selecciona "Todas", limpia la selección
      newSelectedCategories.clear();
    } else if (newSelectedCategories.has(categoryName)) {
      newSelectedCategories.delete(categoryName);
    } else {
      newSelectedCategories.add(categoryName);
    }
    
    setSelectedCategories(newSelectedCategories);
  };

  const handleTagChange = (e) => {
    const newSelectedTags = new Set(Array.isArray(e.target.value) ? e.target.value : [e.target.value]);
    setSelectedTags(newSelectedTags);
  };

  const handleSearch = async (searchValue) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        if (mapInstance) {
          mapInstance.setView([parseFloat(lat), parseFloat(lon)], 16);
        }
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    }
  };

  // Filtrar marcadores basados en las categorías y tags seleccionados
  const filteredMarkers = markers.filter(marker => {
    const matchCategory = selectedCategories.size === 0 || selectedCategories.has(marker.category);
    const matchTag = selectedTags.size === 0 || selectedTags.has(marker.tag);
    return matchCategory && matchTag;
  });

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
    <div className="flex flex-col h-screen relative">
      <div className="z-[1003]">
        {user ? <HeaderLogged /> : <Header />}
      </div>
      
      <div className="flex-grow relative">
        <div className="absolute inset-0 z-[900]">
          <SearchControl onSearch={handleSearch} />
          <MapFilters
            categories={categories}
            tags={tags}
            selectedCategories={Array.from(selectedCategories)}
            selectedTags={Array.from(selectedTags)}
            onCategoryChange={handleCategoryChange}
            onTagChange={handleTagChange}
          />
          <MapContainer
            center={[36.7213, -4.4214]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            ref={setMapInstance}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
            <MapClickHandler onClick={handleMapClick} />
            {filteredMarkers.map((marker, idx) => (
              <Marker 
                key={marker.id || idx} 
                position={[marker.location?.latitude || marker.position[0], marker.location?.longitude || marker.position[1]]}
              >
                <BookmarkPopup marker={marker} />
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {user && formPosition && (
          <div className="absolute inset-0 z-[901]">
            <MarkerForm
              position={formPosition}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
}