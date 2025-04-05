import axios from 'axios';

const API_URL = "http://localhost:3000/api/auth";


const api = axios.create({
  baseURL: "http://localhost:3000",
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