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

export const updateTask = async (id: number, data: Partial<Task>) => {
    try {
        const response = await axios.put(`${API_URL}/tasks/${id}`, data, {
            headers: { Authorization: `Bearer ${token()}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar la tarea con ID ${id}:`, error);
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
