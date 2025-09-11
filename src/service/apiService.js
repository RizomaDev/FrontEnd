import axios from "axios";

import { API_BASE_URL } from '../config/apiConfig';
const API_BASE = API_BASE_URL;


const baseUrl = `${API_BASE}/bookmarks`;
const categoriesUrl = `${API_BASE}/categories/all`;
const tagsUrl = `${API_BASE}/tags/all`;
const usersUrl = `${API_BASE}/user`; 

const CACHE_KEYS = {
  BOOKMARKS: 'cached_bookmarks',
  CATEGORIES: 'cached_categories',
  TAGS: 'cached_tags',
  USERS: 'cached_users',
  TIMESTAMP: '_timestamp'
};

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

const getCacheItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { data, timestamp } = JSON.parse(item);
    const now = new Date().getTime();
    
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
  }
};

const clearCache = () => {
  Object.values(CACHE_KEYS).forEach(key => localStorage.removeItem(key));
};

export function getAllBookmarks() {
  const cachedData = getCacheItem(CACHE_KEYS.BOOKMARKS);
  if (cachedData) {
    return Promise.resolve(cachedData);
  }
  
  return axios
    .get(baseUrl)
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
      clearCache();
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
      clearCache(); 
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
      clearCache();
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
  
  const bookmarkUser = JSON.parse(localStorage.getItem("user"));
  if (bookmarkUser && bookmarkUser.id === parseInt(id)) {
    return Promise.resolve({
      id: bookmarkUser.id,
      name: bookmarkUser.name || bookmarkUser.username || "Usuario Anónimo"
    });
  }
  
  const url = `${API_BASE}/auth/user/${id}`;
  
  return axios
    .get(url, {
      ...getRequestOptions(),
      headers: {
        ...getRequestOptions().headers,
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      const data = response.data;
      
      const userData = {
        id: data.id,
        name: data.name || data.username || "Usuario Anónimo",
      };
      
      setCacheItem(cacheKey, userData);
      return userData;
    })
    .catch((error) => {
      if (bookmarkUser) {
        const defaultUser = {
          id: id,
          name: bookmarkUser.name || "Usuario Anónimo"
        };
        return defaultUser;
      }

      const defaultUser = {
        id: id,
        name: "Usuario Anónimo"
      };
      return defaultUser;
    });
}


export function refreshData() {
  clearCache();
  return Promise.all([
    getAllBookmarks(),
    getCategories(),
    getTags()
  ]);
}
