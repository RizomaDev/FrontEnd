import axios from "axios";

const baseUrl = "http://localhost:8080/api/bookmarks";
const categoriesUrl = "http://localhost:8080/api/categories/all";
const tagsUrl = "http://localhost:8080/api/tags/all";

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
  // Intentar obtener del caché primero
  const cacheKey = `${CACHE_KEYS.USERS}_${id}`;
  const cachedData = getCacheItem(cacheKey);
  if (cachedData) {
    return Promise.resolve(cachedData);
  }

  const url = `http://localhost:8080/api/users/${id}`;
  return axios
    .get(url, getRequestOptions())
    .then((response) => {
      const data = response.data;
      setCacheItem(cacheKey, data);
      return data;
    })
    .catch((error) => {
      // Si hay un error 500, devolver un usuario por defecto
      if (error.response?.status === 500) {
        const defaultUser = {
          id: id,
          name: "Usuario",
          email: "No disponible"
        };
        setCacheItem(cacheKey, defaultUser);
        return defaultUser;
      }
      throw error;
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
