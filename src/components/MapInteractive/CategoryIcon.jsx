import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { tagIcons } from '../../config/categoryIcons';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../constants/mapConstants';
import { normalizeString } from '../../utils/stringUtils';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const TAG_MAPPING = {
  'feminismo': 'Feminismos',
  'feminismos': 'Feminismos',
  'economia': 'Economía y empleo',
  'economia y empleo': 'Economía y empleo',
  'economía': 'Economía y empleo',
  'economía y empleo': 'Economía y empleo',
  'empleo': 'Economía y empleo',
  'servicios publicos': 'Servicios Públicos',
  'memoria democratica': 'Memoria democrática'
};

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

// Caché de iconos para evitar búsquedas repetidas
const iconCache = new Map();

const getIconForName = (name) => {
  if (!name) return null;
  
  // Verificar el caché primero
  const cachedIcon = iconCache.get(name.toLowerCase());
  if (cachedIcon) return cachedIcon;

  // 1. Intentar directamente
  let icon = tagIcons[name];
  if (icon) {
    iconCache.set(name.toLowerCase(), icon);
    return icon;
  }

  // 2. Intentar con el mapeo directo
  const mappedName = TAG_MAPPING[name.toLowerCase()];
  if (mappedName) {
    icon = tagIcons[mappedName];
    if (icon) {
      iconCache.set(name.toLowerCase(), icon);
      return icon;
    }
  }

  // 3. Intentar con normalización
  const normalizedName = normalizeString(name);
  
  // Intentar primero con el mapeo normalizado
  const normalizedMappedName = TAG_MAPPING[normalizedName];
  if (normalizedMappedName) {
    icon = tagIcons[normalizedMappedName];
    if (icon) {
      iconCache.set(name.toLowerCase(), icon);
      return icon;
    }
  }

  // Buscar en las claves de tagIcons
  const matchingKey = Object.keys(tagIcons).find(
    key => normalizeString(key) === normalizedName
  );
  if (matchingKey) {
    icon = tagIcons[matchingKey];
    iconCache.set(name.toLowerCase(), icon);
    return icon;
  }

  // Si no se encuentra, guardar el icono por defecto en el caché
  const defaultIcon = tagIcons['Medio Ambiente'];
  iconCache.set(name.toLowerCase(), defaultIcon);
  return defaultIcon;
};

/**
 * @param {string} props.category - Categoría del marcador
 * @param {string} props.tag - Etiqueta del marcador
 * @param {string} [props.size='md'] - Tamaño del icono ('sm', 'md', 'lg')
 * @param {Object} [props.style] - Estilos adicionales para el contenedor
 * @param {string} [props.className] - Clases adicionales para el contenedor
 */
export default function CategoryIcon({ category, tag, size = 'md', style = {}, className = '' }) {
  const categoryLower = category ? category.toLowerCase() : '';
  
  // Special case for temporary markers
  if (category === 'temp') {
    const sizeClasses = sizes[size] || sizes.md;
    return (
      <div 
        className={`rounded-full flex items-center justify-center animate-pulse ${sizeClasses.container} ${className}`}
        style={{ 
          backgroundColor: '#4CAF50',
          border: '3px solid white',
          boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)',
          ...style
        }}
      >
        <FontAwesomeIcon 
          icon={faLocationDot}
          className={`text-white ${sizeClasses.icon}`}
          fixedWidth
        />
      </div>
    );
  }

  // Memoizar la búsqueda del icono
  const icon = useMemo(() => {
    let foundIcon = tag ? getIconForName(tag) : null;
    if (!foundIcon && category) {
      foundIcon = getIconForName(category);
    }
    return foundIcon || tagIcons['Medio Ambiente'];
  }, [tag, category]);

  const backgroundColor = CATEGORY_COLORS[categoryLower] || DEFAULT_CATEGORY_COLOR;
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