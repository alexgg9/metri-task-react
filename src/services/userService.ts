import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const API = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const getCurrentUser = async () => {
  try {
    const response = await API.get('/user');
    return response.data;
  } catch (error) {
    console.error('Error al obtener el usuario autenticado:', error);
    throw error;
  }
};

export const updateUser = async (userId: number, updatedUserData: any) => {
  try {
    const response = await API.put(`/user/${userId}`, updatedUserData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};
