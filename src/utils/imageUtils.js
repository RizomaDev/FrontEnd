import { API_BASE_URL } from '../config/apiConfig';

export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    const imageId = imagePath.split('/').pop();
    return `${API_BASE_URL}/images/${imageId}`;
};
