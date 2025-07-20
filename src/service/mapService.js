const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

/**
 * Search for a location using OpenStreetMap's Nominatim service
  @param {string} searchValue - The location to search for
 *@returns {Promise<{lat: number, lon: number} | null>} The coordinates of the first result
 */
export const searchLocation = async (searchValue) => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(searchValue)}`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return {
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Error searching location:', error);
    throw error;
  }
}; 