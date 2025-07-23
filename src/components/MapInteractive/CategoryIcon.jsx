import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { tagIcons } from '../../config/categoryIcons';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../constants/mapConstants';
import { normalizeString } from '../../utils/stringUtils';

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

/**
 * @param {string} props.category - Categoría del marcador
 * @param {string} props.tag - Etiqueta del marcador
 * @param {string} [props.size='md'] - Tamaño del icono ('sm', 'md', 'lg')
 * @param {Object} [props.style] - Estilos adicionales para el contenedor
 * @param {string} [props.className] - Clases adicionales para el contenedor
 */
export default function CategoryIcon({ category, tag, size = 'md', style = {}, className = '' }) {
  const categoryLower = category ? category.toLowerCase() : '';
  
  const getIconForName = (name) => {
    if (!name) return null;
    
    // Debug: ver el nombre que llega
    console.log('Buscando icono para:', name);
    
    // 1. Intentar directamente
    let icon = tagIcons[name];
    if (icon) {
      console.log('Encontrado directamente');
      return icon;
    }

    // 2. Intentar con el mapeo directo
    const mappedName = TAG_MAPPING[name.toLowerCase()];
    if (mappedName) {
      icon = tagIcons[mappedName];
      if (icon) {
        console.log('Encontrado por mapeo:', mappedName);
        return icon;
      }
    }

    // 3. Intentar con normalización
    const normalizedName = normalizeString(name);
    console.log('Nombre normalizado:', normalizedName);
    
    // Intentar primero con el mapeo normalizado
    const normalizedMappedName = TAG_MAPPING[normalizedName];
    if (normalizedMappedName) {
      icon = tagIcons[normalizedMappedName];
      if (icon) {
        console.log('Encontrado por mapeo normalizado:', normalizedMappedName);
        return icon;
      }
    }

    // Buscar en las claves de tagIcons
    const matchingKey = Object.keys(tagIcons).find(
      key => normalizeString(key) === normalizedName
    );
    if (matchingKey) {
      console.log('Encontrado por coincidencia normalizada:', matchingKey);
      return tagIcons[matchingKey];
    }

    console.log('No se encontró icono');
    return null;
  };

  // Intentar obtener el icono primero del tag, luego de la categoría
  let icon = tag ? getIconForName(tag) : null;
  if (!icon && category) {
    icon = getIconForName(category);
  }
  
  // Si aún no hay icono, usar el default
  if (!icon) {
    console.log('Usando icono por defecto');
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