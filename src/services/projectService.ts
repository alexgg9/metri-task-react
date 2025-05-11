import axios from "axios";
import { Project } from "../types/project";
import { Task } from "../types/task";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"; 
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

export const getProjectById = async (id: number): Promise<Project | null> => {
    try {
        const response = await axios.get(`${API_URL}/projects/${id}`, {
            headers: { Authorization: `Bearer ${token()}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el proyecto con ID ${id}:`, error);
        return null;
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

export const getProjectTasks = async (projectId: number): Promise<Task[]> => {
    try {
        const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`, {
            headers: { Authorization: `Bearer ${token()}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener tareas del proyecto ${projectId}:`, error);
        return [];
    }
};
