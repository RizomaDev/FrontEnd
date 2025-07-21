export const capitalizeWords = (str) => {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Normaliza un string para comparaciones consistentes
 * Convierte a minúsculas y elimina acentos
 * @param {string} str - String a normalizar
 * @returns {string} String normalizado
 */
export const normalizeString = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}; 