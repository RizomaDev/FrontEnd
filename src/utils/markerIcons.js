import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { tagIcons } from '../config/categoryIcons';
import ReactDOMServer from 'react-dom/server';

export const CATEGORY_COLORS = {
  'conflictos': '#FF4444',    // Rojo
  'propuestas': '#00C853',    // Verde
  'iniciativas': '#FFD700'    // Dorado
};

const capitalizeWords = (str) => {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const createCustomIcon = (category, tag) => {
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
      ">
        ${iconHtml}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
}; 