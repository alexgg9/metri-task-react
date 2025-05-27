import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token disponible');
    }

    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al obtener usuario:', error.response?.status, error.response?.data);
    }
    throw error;
  }
};

export const getUserInfo = getCurrentUser; 

export const updateUser = async (userId: number, updatedUserData: any) => {
  try {
    const response = await API.put(`/user/${userId}`, updatedUserData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};
