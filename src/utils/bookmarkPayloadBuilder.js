/**
 * Convierte un archivo a base64
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} - Base64 del archivo
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
}

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
 * @returns {Object[]} - Array de objetos de imagen
 */
function processCloudinaryImages(imageUrls) {
  return imageUrls.map(url => ({ 
    url, 
    name: 'cloudinary-image', 
    type: 'image/cloudinary',
    size: 0
  }));
}

/**
 * Procesa imágenes que son archivos File
 * @param {File[]} files - Array de archivos
 * @returns {Promise<Object[]>} - Array de objetos de imagen con base64
 */
async function processFileImages(files) {
  const images = [];
  for (let file of files) {
    const base64 = await fileToBase64(file);
    images.push({ 
      base64, 
      name: file.name, 
      type: file.type, 
      size: file.size 
    });
  }
  return images;
}

/**
 * Construye el payload para un bookmark con URLs de Cloudinary (síncrono)
 * @param {Object} data - Datos del formulario con imageUrls
 * @returns {Object} - Payload completo
 */
export function buildBookmarkPayloadSimple(data) {
  const basePayload = buildBasePayload(data);
  
  // Procesar imágenes (URLs de Cloudinary)
  const images = data.images && data.images.length > 0 
    ? processCloudinaryImages(data.images)
    : [];

  return {
    ...basePayload,
    images
  };
}

/**
 * Construye el payload para un bookmark con archivos File (asíncrono)
 * @param {Object} data - Datos del formulario con archivos
 * @returns {Promise<Object>} - Payload completo
 */
export async function buildBookmarkPayload(data) {
  const basePayload = buildBasePayload(data);
  
  // Procesar imágenes (archivos File)
  const images = data.images && data.images.length > 0 
    ? await processFileImages(data.images)
    : [];

  return {
    ...basePayload,
    images
  };
}
