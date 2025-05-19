import axios from "axios";
import { Task } from "../types/task";

const API_URL = import.meta.env.VITE_API_URL;
const token = () => localStorage.getItem("token");


export const getTasks = async (): Promise<Task[]> => {
    try {
        const response = await axios.get(`${API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token()}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener las tareas:", error);
        return []; 
    }
};


export const getTaskById = async (id: number): Promise<Task | null> => {
    try {
        const response = await axios.get(`${API_URL}/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token()}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener la tarea con ID ${id}:`, error);
        return null; 
    }
};


export const createTask = async (data: Partial<Task>) => {
    try {
        const response = await axios.post(`${API_URL}/tasks`, data, {
            headers: { Authorization: `Bearer ${token()}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear la tarea:", error);
        throw error; 
    }
};

export const updateTask = async (taskId: number, taskData: Partial<Task>): Promise<Task> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        // Asegurarnos de que solo enviamos los campos necesarios
        const dataToSend = {
            name: taskData.name,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            dueDate: taskData.dueDate,
            project_id: taskData.project_id
        };

        const response = await axios.put(`${API_URL}/tasks/${taskId}`, dataToSend, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error al actualizar la tarea:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Error al actualizar la tarea');
        }
        throw error;
    }
};

export const deleteTask = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token()}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar la tarea con ID ${id}:`, error);
        throw error;
    }
};

export const getTasksByProjectId = async (projectId: number) => {
    try {
        console.log('Obteniendo tareas para el proyecto:', projectId);
        console.log('URL de la API:', API_URL);
        const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`, {
            headers: { Authorization: `Bearer ${token()}` },
        });
        console.log('Respuesta del servidor:', response);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error al obtener tareas del proyecto:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        } else {
            console.error('Error al obtener tareas del proyecto:', error);
        }
        throw error;
    }
};
