const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

/**
  @param {string} searchTerm - The location to search for
 *@returns {Promise<{lat: number, lon: number} | null>} The coordinates of the first result
 */
export const searchLocation = async (searchTerm) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getLocationName = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    
    if (data && data.display_name) {
      const parts = data.display_name.split(',');
      const relevantParts = parts.slice(0, 3);
      return relevantParts.join(', ');
    }
    return 'Ubicación desconocida';
  } catch (error) {
    return 'Ubicación desconocida';
  }
}; 