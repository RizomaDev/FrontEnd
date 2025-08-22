import axios from "axios";

import { API_BASE_URL } from '../config/apiConfig';
const baseUrl = `${API_BASE_URL}/auth`;

export async function login(credentials) {
  try {
    console.log('Sending login request to:', `${baseUrl}/login`);
    const response = await axios.post(`${baseUrl}/login`, credentials);
    console.log('Login response:', response);
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Login error:', error.response || error);
    throw error;
  }
}

export async function register(userData) {
  try {
    const requestData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      countryCode: userData.countryCode || "ES",
    };
    console.log('Sending registration request to:', `${baseUrl}/register`);
    console.log('Request data:', requestData);
    const response = await axios.post(`${baseUrl}/register`, requestData);
    console.log('Registration response:', response);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response || error);
    throw error;
  }
}

export function logout() {
  localStorage.removeItem("user");
}