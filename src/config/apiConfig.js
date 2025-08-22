const isDevelopment = process.env.NODE_ENV === 'development';
export const API_BASE_URL = isDevelopment 
  ? "http://localhost:8080/api"  // Backend local
  : "https://backend-itbo.onrender.com/api";  // Backend producción

export const ENDPOINTS = {
    IMAGES: `${API_BASE_URL}/images`,
    BOOKMARKS: `${API_BASE_URL}/bookmarks`,
    CATEGORIES: `${API_BASE_URL}/categories`,
    TAGS: `${API_BASE_URL}/tags`,
    AUTH: `${API_BASE_URL}/auth`
};
