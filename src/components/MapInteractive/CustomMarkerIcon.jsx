import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDOMServer from 'react-dom/server';
import { tagIcons } from '../../config/categoryIcons';
import { normalizeString } from '../../utils/stringUtils';
import { CATEGORY_COLORS, TAG_MAPPING, DEFAULT_TAG } from '../../constants/mapConstants';

export const createCustomIcon = (category, tag) => {
  const categoryLower = category ? category.toLowerCase() : '';
  const normalizedTag = normalizeString(tag || '');
  
  const matchingTag = Object.keys(tagIcons).find(
    availableTag => normalizeString(availableTag) === normalizedTag
  );

  const effectiveTag = TAG_MAPPING[normalizedTag] || matchingTag || tag;
  const backgroundColor = CATEGORY_COLORS[categoryLower] || '#9E9E9E';
  const icon = tagIcons[effectiveTag] || tagIcons[tag] || tagIcons[DEFAULT_TAG];

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