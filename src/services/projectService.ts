import axios from "axios";
import { Project } from "../types/project";

const API_URL = import.meta.env.VITE_API_URL;
const token = () => localStorage.getItem("token");

export const getProjects = async (): Promise<Project[]> => {
    try {
        const response = await axios.get(`${API_URL}/projects`, {
            headers: { Authorization: `Bearer ${token()}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        return [];
    }
};

export const createProject = async (data: Partial<Project>) => {
    try {
        const response = await axios.post(`${API_URL}/projects`, data, {
            headers: { Authorization: `Bearer ${token()}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear el proyecto:", error);
        throw error; 
    }
};

export const updateProject = async (id: number, data: Partial<Project>) => {
    try {
        const response = await axios.put(`${API_URL}/projects/${id}`, data, {
            headers: { Authorization: `Bearer ${token()}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el proyecto:", error);
        throw error;
    }
};

export const deleteProject = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/projects/${id}`, {
            headers: { Authorization: `Bearer ${token()}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el proyecto:", error);
        throw error;
    }
};
