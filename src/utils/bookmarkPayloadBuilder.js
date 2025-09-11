
/**
 * Construye el payload base para un bookmark
 * @param {Object} data - Datos del formulario
 * @returns {Object} - Payload base sin imágenes
 */
function buildBasePayload(data) {
  const location = (data.latitude && data.longitude)
    ? { latitude: parseFloat(data.latitude), longitude: parseFloat(data.longitude) }
    : undefined;

  return {
    title: data.title,
    description: data.description,
    tagId: Number(data.tagId),
    categoryId: Number(data.categoryId),
    video: data.video || "",
    url: data.url || "",
    location,
    publicationDate: new Date().toISOString(),
  };
}

/**
 * Procesa imágenes que son URLs de Cloudinary
 * @param {string[]} imageUrls - Array de URLs de Cloudinary
 * @returns {string[]} - Array de URLs (sin procesamiento adicional)
 */
function processCloudinaryImages(imageUrls) {
  return imageUrls; // Devolver las URLs directamente
}


/**
 * Construye el payload para un bookmark con URLs de Cloudinary (síncrono)
 * @param {Object} data - Datos del formulario con imageUrls
 * @returns {Object} - Payload completo
 */
export function buildBookmarkPayloadSimple(data) {
  const basePayload = buildBasePayload(data);
  
  // Procesar imágenes (URLs de Cloudinary)
  const imageUrls = data.imageUrls && data.imageUrls.length > 0 
    ? processCloudinaryImages(data.imageUrls)
    : [];

  return {
    ...basePayload,
    imageUrls // Cambiar de 'images' a 'imageUrls' para coincidir con el backend
  };
}

