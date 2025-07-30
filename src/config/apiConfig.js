export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const ENDPOINTS = {
    IMAGES: `${API_BASE_URL}/images`,
    BOOKMARKS: `${API_BASE_URL}/bookmarks`,
    CATEGORIES: `${API_BASE_URL}/categories`,
    TAGS: `${API_BASE_URL}/tags`,
    AUTH: `${API_BASE_URL}/auth`
};
