import { API_BASE_URL } from '../config/apiConfig';

export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // Si es una URL de Cloudinary, devolverla directamente
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Si es una ruta local del backend, construir la URL completa
    const imageId = imagePath.split('/').pop();
    return `${API_BASE_URL}/images/${imageId}`;
};
