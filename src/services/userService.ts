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
    console.log('Intentando obtener usuario actual...');
    const token = localStorage.getItem('token');
    console.log('Token encontrado:', !!token);

    if (!token) {
      throw new Error('No hay token disponible');
    }

    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error detallado al obtener usuario:', error);
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
    }
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
