import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { tagIcons } from '../../config/categoryIcons';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../constants/mapConstants';
import { normalizeString } from '../../utils/stringUtils';

/**
 * Componente reutilizable para mostrar iconos de categorías
 * @param {Object} props
 * @param {string} props.category - Categoría del marcador
 * @param {string} props.tag - Etiqueta del marcador
 * @param {string} [props.size='md'] - Tamaño del icono ('sm', 'md', 'lg')
 * @param {Object} [props.style] - Estilos adicionales para el contenedor
 * @param {string} [props.className] - Clases adicionales para el contenedor
 */
export default function CategoryIcon({ category, tag, size = 'md', style = {}, className = '' }) {
  const categoryLower = category ? category.toLowerCase() : '';
  const normalizedTag = tag ? normalizeString(tag) : '';
  
  // Buscar el icono primero por tag normalizado, luego por tag original, y finalmente por categoría
  const icon = tagIcons[normalizedTag] || tagIcons[tag] || tagIcons[category] || tagIcons['Medio Ambiente'];
  const backgroundColor = CATEGORY_COLORS[categoryLower] || DEFAULT_CATEGORY_COLOR;

  // Configuración de tamaños
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
      {icon && (
        <FontAwesomeIcon 
          icon={icon} 
          className={`text-white ${sizeClasses.icon}`}
          fixedWidth
        />
      )}
    </div>
  );
} 