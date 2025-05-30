import axios from 'axios';
import { User } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem('token');

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await axios.get(`${API_URL}/user`, authHeader());
    return res.data;
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    return null;
  }
};

export const getProjectUsers = async (projectId: number): Promise<User[]> => {
  try {
    const tokenValue = getToken();
    if (!tokenValue) {
      throw new Error('No hay token de autenticación');
    }

    const url = `${API_URL}/projects/${projectId}/users`;
    console.log('Obteniendo usuarios del proyecto:', {
      url,
      projectId
    });

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${tokenValue}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Respuesta de usuarios del proyecto:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al obtener usuarios del proyecto:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
    } else {
      console.error('Error al obtener usuarios del proyecto:', error);
    }
    throw error;
  }
};

export const getUserInfo = getCurrentUser; 

export const updateUser = async (userId: number, updatedUserData: any) => {
  try {
    const response = await axios.put(`${API_URL}/user/${userId}`, updatedUserData, authHeader());
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};

// Nuevas funciones para manejar usuarios en proyectos
export const addUserToProject = async (projectId: number, userId: number): Promise<void> => {
  try {
    await axios.post(`${API_URL}/projects/${projectId}/users`, { user_id: userId }, authHeader());
  } catch (error) {
    console.error('Error al añadir usuario al proyecto:', error);
    throw error;
  }
};

export const removeUserFromProject = async (projectId: number, userId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/projects/${projectId}/users/${userId}`, authHeader());
  } catch (error) {
    console.error('Error al eliminar usuario del proyecto:', error);
    throw error;
  }
};

// Función para obtener todos los usuarios (útil para añadir a proyectos)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const res = await axios.get(`${API_URL}/users`, authHeader());
    return res.data;
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    return [];
  }
};