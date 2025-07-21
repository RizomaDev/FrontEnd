import React from 'react';
import { Popup } from 'react-leaflet';      
import Buttons from '../Buttons/Buttons';
import CategoryIcon from './CategoryIcon';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../constants/mapConstants';

export default function BookmarkPopup({ marker }) {
  const categoryLower = marker.category ? marker.category.toLowerCase() : '';
  const backgroundColor = CATEGORY_COLORS[categoryLower] || DEFAULT_CATEGORY_COLOR;

  // Mapear categorías a clases de botones del tema
  const getButtonClasses = (category) => {
    switch (category?.toLowerCase()) {
      case 'conflictos':
        return 'btn-primary text-primary-content';
      case 'propuestas':
        return 'btn-success text-success-content';
      case 'iniciativas':
        return 'btn-warning text-warning-content';
      default:
        return 'btn-neutral text-neutral-content';
    }
  };

  return (
    <Popup>
      <div className="max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <CategoryIcon 
            category={marker.category} 
            tag={marker.tag} 
            size="md"
          />
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
                backgroundColor: 'oklch(0.7036 0.0814 186.26)', // color-secondary
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
        {marker.id && (
          <div className="mt-4 flex justify-end">
            <Buttons
              to={`/BookmarkDetails/${marker.id}`}
              className={`btn btn-sm ${getButtonClasses(marker.category)}`}
            >
              Ver más detalles
            </Buttons>
          </div>
        )}
      </div>
    </Popup>
  );
} 