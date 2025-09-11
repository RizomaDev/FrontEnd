import { Popup } from 'react-leaflet';      
import Buttons from '../Buttons/Buttons';
import CategoryIcon from './CategoryIcon';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../constants/mapConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faLink } from '@fortawesome/free-solid-svg-icons';

export default function BookmarkPopup({ marker }) {
  const categoryLower = marker.category ? marker.category.toLowerCase() : '';
  const backgroundColor = CATEGORY_COLORS[categoryLower] || DEFAULT_CATEGORY_COLOR;

  const getButtonClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'conflictos':
        return 'btn-primary';
      case 'propuestas':
        return 'btn-success';
      case 'iniciativas':
        return 'btn-warning';
      default:
        return 'btn-neutral';
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
                backgroundColor: 'oklch(0.7036 0.0814 186.26)', 
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
        
        {marker.videoUrl && (
          <div className="mt-2">
            <a 
              href={marker.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary-focus flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faVideo} />
              Ver video
            </a>
          </div>
        )}

        {marker.infoAdicional && (
          <div className="mt-2">
            <a 
              href={marker.infoAdicional}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary-focus flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faLink} />
              Más información
            </a>
          </div>
        )}
       
        {marker.imageUrls && marker.imageUrls.length > 0 && (
          <div className="mt-2">
            <img
              src={marker.imageUrls[0]}
              alt={marker.title}
              className="w-full h-32 object-cover rounded"
            />
            {marker.imageUrls.length > 1 && (
              <p className="text-xs text-gray-500 mt-1 text-center">
                +{marker.imageUrls.length - 1} imagen{marker.imageUrls.length - 1 > 1 ? 'es' : ''} más
              </p>
            )}
          </div>
        )}

        {marker.id && (
          <div className="mt-4 flex justify-end">
            <Buttons
              to={`/BookmarkDetails/${marker.id}`}
              color={getButtonClass(marker.category)}
              className="btn-sm !text-white"
              style={{
                color: 'white !important'
              }}
            >
              Ver más detalles
            </Buttons>
          </div>
        )}
      </div>
    </Popup>
  );
} 