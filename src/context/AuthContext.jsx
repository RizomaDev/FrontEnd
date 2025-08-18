import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

import { API_BASE_URL } from '../config/apiConfig';
const baseUrl = `${API_BASE_URL}/auth`;
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      try {
        const decodedUser = jwtDecode(user.token);
        setUser(decodedUser);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${baseUrl}/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        const decodedUser = jwtDecode(response.data.token);
        setUser(decodedUser);
        
        return response.data;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};