import axios from "axios";

import { API_BASE_URL } from '../config/apiConfig';
const API_BASE = API_BASE_URL;

// API endpoints
const baseUrl = `${API_BASE}/bookmarks`;
const categoriesUrl = `${API_BASE}/categories/all`;
const tagsUrl = `${API_BASE}/tags/all`;
const usersUrl = `${API_BASE}/user`; // Cambiado de 'users' a 'user' para coincidir con el patrón del backend

// Constantes para las claves del caché
const CACHE_KEYS = {
  BOOKMARKS: 'cached_bookmarks',
  CATEGORIES: 'cached_categories',
  TAGS: 'cached_tags',
  USERS: 'cached_users',
  TIMESTAMP: '_timestamp'
};

// Tiempo de expiración del caché (en minutos)
const CACHE_EXPIRATION = 5;

function getRequestOptions() {
  const user = JSON.parse(localStorage.getItem("user"));
  return {
    headers: {
      ...(user && user.token ? { Authorization: `Bearer ${user.token}` } : {}),
      ...(user && user.id ? { "X-User-ID": user.id } : {}),
    },
  };
}

// Funciones auxiliares para el manejo del caché
const getCacheItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { data, timestamp } = JSON.parse(item);
    const now = new Date().getTime();
    
    // Verificar si el caché ha expirado
    if (now - timestamp > CACHE_EXPIRATION * 60 * 1000) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    return null;
  }
};

const setCacheItem = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Error caching data:', error);
  }
};

const clearCache = () => {
  Object.values(CACHE_KEYS).forEach(key => localStorage.removeItem(key));
};

export function getAllBookmarks() {
  // Intentar obtener del caché primero
  const cachedData = getCacheItem(CACHE_KEYS.BOOKMARKS);
  if (cachedData) {
    return Promise.resolve(cachedData);
  }
  
  return axios
    .get(baseUrl, getRequestOptions())
    .then((response) => {
      const data = response.data;
      setCacheItem(CACHE_KEYS.BOOKMARKS, data);
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

export function searchBookmarks(searchTerm) {
  return axios
    .get(`${baseUrl}/search`, {
      ...getRequestOptions(),
      params: { title: searchTerm.trim() },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function getBookmarkById(id) {
  const url = `${baseUrl}/${id}`;
  return axios
    .get(url, getRequestOptions())
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function createBookmark(bookmarkData) {
  const isFormData = bookmarkData instanceof FormData;
  return axios
    .post(baseUrl, bookmarkData, {
      headers: {
        ...getRequestOptions().headers,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    })
    .then((response) => {
      clearCache(); // Limpiar caché cuando se crea un nuevo bookmark
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function updateBookmark(id, updatedExperiences) {
  const url = `${baseUrl}/${id}`;
  return axios
    .put(url, updatedExperiences, getRequestOptions())
    .then((response) => {
      clearCache(); // Limpiar caché cuando se actualiza un bookmark
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function deleteBookmark(id) {
  const url = `${baseUrl}/${id}`;
  return axios
    .delete(url, getRequestOptions())
    .then((response) => {
      clearCache(); // Limpiar caché cuando se elimina un bookmark
      if (response.status === 204) {
        
        return true;
      } else {
        throw new Error(`Respuesta inesperada: ${response.status}`);
      }
    })
    .catch((error) => {
      throw error;
    });
}

export function getCategories() {
  const cachedData = getCacheItem(CACHE_KEYS.CATEGORIES);
  if (cachedData) {
    return Promise.resolve(cachedData);
  }

  return axios
    .get(categoriesUrl, getRequestOptions())
    .then((response) => {
      const data = response.data;
      setCacheItem(CACHE_KEYS.CATEGORIES, data);
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

export function getTags() {
  const cachedData = getCacheItem(CACHE_KEYS.TAGS);
  if (cachedData) {
    return Promise.resolve(cachedData);
  }

  return axios
    .get(tagsUrl, getRequestOptions())
    .then((response) => {
      const data = response.data;
      setCacheItem(CACHE_KEYS.TAGS, data);
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

export function getUserById(id) {
  const cacheKey = `${CACHE_KEYS.USERS}_${id}`;
  localStorage.removeItem(cacheKey);
  
  // Primero intentamos obtener el usuario del localStorage
  const bookmarkUser = JSON.parse(localStorage.getItem("user"));
  if (bookmarkUser && bookmarkUser.id === parseInt(id)) {
    console.log("Using current user data:", bookmarkUser);
    return Promise.resolve({
      id: bookmarkUser.id,
      name: bookmarkUser.name || bookmarkUser.username || "Usuario Anónimo"
    });
  }
  
  const url = `${API_BASE}/auth/user/${id}`;  // Cambiamos a usar el endpoint de auth
  console.log("Fetching user from API:", url);
  
  return axios
    .get(url, {
      ...getRequestOptions(),
      headers: {
        ...getRequestOptions().headers,
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      console.log("Raw API response:", response);
      const data = response.data;
      
      const userData = {
        id: data.id,
        name: data.name || data.username || "Usuario Anónimo",
      };
      
      console.log("Processed user data:", userData);
      setCacheItem(cacheKey, userData);
      return userData;
    })
    .catch((error) => {
      console.error("Error in getUserById. Status:", error.response?.status);
      console.error("Error details:", {
        message: error.response?.data?.message,
        data: error.response?.data,
        config: error.config
      });

      // Intentar obtener el nombre del usuario del bookmark si está disponible
      if (bookmarkUser) {
        const defaultUser = {
          id: id,
          name: bookmarkUser.name || "Usuario Anónimo"
        };
        console.log("Using bookmark user name as fallback");
        return defaultUser;
      }

      const defaultUser = {
        id: id,
        name: "Usuario Anónimo"
      };
      console.log("Using default user due to API error");
      return defaultUser;
    });
}

const onSubmit = async (data) => {
  const t0 = performance.now();
  const payload = await buildBookmarkPayload(data);
  await createBookmark(payload);
  const t1 = performance.now();
  console.log("Tiempo total de creación:", (t1 - t0) / 1000, "segundos");
  // ...
};

// Función para forzar una actualización de los datos
export function refreshData() {
  clearCache();
  return Promise.all([
    getAllBookmarks(),
    getCategories(),
    getTags()
  ]);
}
