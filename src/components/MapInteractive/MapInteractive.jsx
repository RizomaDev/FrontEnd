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
import MarkerForm from './Markerform';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { tagIcons, categoryColors } from '../../config/categoryIcons';
import ReactDOMServer from 'react-dom/server';

const capitalizeWords = (str) => {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const CATEGORY_COLORS = {
  'conflictos': '#FF4444',    // Rojo
  'propuestas': '#00C853',    // Verde
  'iniciativas': '#FFD700'    // Dorado
};

const createCustomIcon = (category, tag) => {
  const categoryLower = category ? category.toLowerCase() : '';
  const tagCapitalized = tag ? capitalizeWords(tag) : '';
  
  const backgroundColor = CATEGORY_COLORS[categoryLower] || '#9E9E9E';
  const icon = tagIcons[tagCapitalized] || tagIcons['Medio Ambiente'];

  const iconHtml = ReactDOMServer.renderToString(
    <FontAwesomeIcon 
      icon={icon} 
      style={{ color: 'white', fontSize: '16px' }} 
    />
  );
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${backgroundColor}; 
        width: 30px; 
        height: 30px; 
        border-radius: 50%; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        position: relative;
        z-index: 1;
      ">
        ${iconHtml}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

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

  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    setIsClient(true);
    const fetchBookmarks = async () => {
      try {
        const bookmarksData = await getAllBookmarks();
        const validBookmarks = bookmarksData.filter(bookmark => 
          bookmark.location && 
          bookmark.location.latitude && 
          bookmark.location.longitude
        );
        
        setMarkers(validBookmarks);

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
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <LocationMarker />
            <MapClickHandler onClick={handleMapClick} />
            {filteredMarkers.map((marker, idx) => (
              <Marker 
                key={marker.id || idx} 
                position={[marker.location?.latitude || marker.position[0], marker.location?.longitude || marker.position[1]]}
                icon={createCustomIcon(marker.category, marker.tag)}
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