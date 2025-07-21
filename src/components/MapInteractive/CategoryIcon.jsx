import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { tagIcons } from '../../config/categoryIcons';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../constants/mapConstants';
import { normalizeString } from '../../utils/stringUtils';

/**
 * @param {Object} props
 * @param {string} props.category - Categoría del marcador
 * @param {string} props.tag - Etiqueta del marcador
 * @param {string} [props.size='md'] - Tamaño del icono ('sm', 'md', 'lg')
 * @param {Object} [props.style] - Estilos adicionales para el contenedor
 * @param {string} [props.className] - Clases adicionales para el contenedor
 */
export default function CategoryIcon({ category, tag, size = 'md', style = {}, className = '' }) {
  const categoryLower = category ? category.toLowerCase() : '';
  
  let icon;
  if (tag) {
    icon = tagIcons[tag];
    if (!icon) {

      const normalizedTag = normalizeString(tag);
      const matchingTag = Object.keys(tagIcons).find(
        availableTag => normalizeString(availableTag) === normalizedTag
      );
      if (matchingTag) {
        icon = tagIcons[matchingTag];
      }
    }
  }
  

  if (!icon && category) {
    icon = tagIcons[category];
    if (!icon) {
      const normalizedCategory = normalizeString(category);
      const matchingCategory = Object.keys(tagIcons).find(
        availableTag => normalizeString(availableTag) === normalizedCategory
      );
      if (matchingCategory) {
        icon = tagIcons[matchingCategory];
      }
    }
  }
  

  if (!icon) {
    icon = tagIcons['Medio Ambiente'];
  }

  const backgroundColor = CATEGORY_COLORS[categoryLower] || DEFAULT_CATEGORY_COLOR;


  const sizes = {
    sm: {
      container: 'w-6 h-6',
      icon: 'text-xs'
    },
    md: {
      container: 'w-8 h-8',
      icon: 'text-sm'
    },
    lg: {
      container: 'w-10 h-10',
      icon: 'text-base'
    }
  };

  const sizeClasses = sizes[size] || sizes.md;

  return (
    <div 
      className={`rounded-full flex items-center justify-center ${sizeClasses.container} ${className}`}
      style={{ 
        backgroundColor,
        border: '2px solid white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        ...style
      }}
    >
      <FontAwesomeIcon 
        icon={icon} 
        className={`text-white ${sizeClasses.icon}`}
        fixedWidth
      />
    </div>
  );
} 