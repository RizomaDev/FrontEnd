import axios from "axios";

const baseUrl = "http://localhost:8080/api/bookmarks";
const categoriesUrl = "http://localhost:8080/api/categories/all";
const tagsUrl = "http://localhost:8080/api/tags/all";

function getRequestOptions() {
  const user = JSON.parse(localStorage.getItem("user"));
  return {
    headers: {
      ...(user && user.token ? { Authorization: `Bearer ${user.token}` } : {}),
      ...(user && user.id ? { "X-User-ID": user.id } : {}),
    },
  };
}

export function getAllBookmarks() {
  
  return axios
    .get(baseUrl, getRequestOptions())
    .then((response) => response.data)
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
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function updateBookmark(id, updatedExperiences) {
  const url = `${baseUrl}/${id}`;
  return axios
    .put(url, updatedExperiences, getRequestOptions())
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function deleteBookmark(id) {
  const url = `${baseUrl}/${id}`;
  return axios
    .delete(url, getRequestOptions())
    .then((response) => {
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
  return axios
    .get(categoriesUrl, getRequestOptions())
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function getTags() {
  return axios
    .get(tagsUrl, getRequestOptions())
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}
