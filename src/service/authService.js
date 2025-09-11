import axios from "axios";

import { API_BASE_URL } from '../config/apiConfig';
const baseUrl = `${API_BASE_URL}/auth`;

export async function login(credentials) {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  }
  return null;
}

export async function register(userData) {
  try {
    const requestData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      countryCode: userData.countryCode || "ES",
    };
    const response = await axios.post(`${baseUrl}/register`, requestData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function logout() {
  localStorage.removeItem("user");
}