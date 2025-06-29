import axios from "axios";

const baseUrl = "http://localhost:8080/api/auth";

export async function login(credentials) {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  }
  return null;
}

export async function register(userData) {
  const requestData = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    countryCode: userData.countryCode || "ES",
  };
  const response = await axios.post(`${baseUrl}/register`, requestData);
  return response.data;
}

export function logout() {
  localStorage.removeItem("user");
}