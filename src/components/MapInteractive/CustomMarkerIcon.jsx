import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import CategoryIcon from './CategoryIcon';

export const createCustomIcon = (category, tag) => {
  const iconHtml = ReactDOMServer.renderToString(
    <CategoryIcon 
      category={category} 
      tag={tag} 
      size="md"
      style={{
        position: 'relative',
        zIndex: 1
      }}
    />
  );
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: iconHtml,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
}; 