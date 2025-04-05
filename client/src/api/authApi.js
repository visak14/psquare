import axios from 'axios';

const API_URL = "https://psquare-backend.onrender.com/api/auth";


const api = axios.create({
  baseURL: "https://psquare-backend.onrender.com",
  withCredentials: true 
});

export const loginUser = async (userData) => {
  const response = await api.post(`/api/auth/login`, userData);
  
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post(`/api/auth/register`, userData);
  
  
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  
  return response.data;
};

export const logoutUser = async () => {
  try {
    
    await api.post(`/api/auth/logout`);
    
   
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
