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


export const createTask = async (data: Partial<Task>): Promise<Task> => {
    try {
        const tokenValue = token();
        if (!tokenValue) {
            throw new Error('No hay token de autenticación');
        }

        console.log('Creando tarea con datos:', {
            url: `${API_URL}/tasks`,
            data,
            headers: {
                'Authorization': 'Bearer [TOKEN]',
                'Content-Type': 'application/json'
            }
        });

        const response = await axios.post(`${API_URL}/tasks`, data, {
            headers: { 
                'Authorization': `Bearer ${tokenValue}`,
                'Content-Type': 'application/json'
            },
        });

        console.log('Respuesta de creación de tarea:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        });

        if (!response.data) {
            throw new Error('No se recibió respuesta al crear la tarea');
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error al crear la tarea:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers
                }
            });
            throw new Error(error.response?.data?.message || 'Error al crear la tarea');
        }
        throw error;
    }
};

export const updateTask = async (taskId: number, taskData: Partial<Task>): Promise<Task> => {
    try {
        const tokenValue = token();
        if (!tokenValue) {
            throw new Error('No hay token de autenticación');
        }

        // Asegurarnos de que el status es uno de los valores permitidos
        const validStatuses = ['pending', 'in progress', 'completed'];
        if (taskData.status && !validStatuses.includes(taskData.status)) {
            console.error('Status inválido:', {
                received: taskData.status,
                valid: validStatuses,
                type: typeof taskData.status
            });
            throw new Error(`Status inválido. Debe ser uno de: ${validStatuses.join(', ')}`);
        }


        const dataToSend = {
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            due_date: taskData.due_date,
            project_id: taskData.project_id,
            user_id: taskData.user_id
        };

        console.log('Enviando datos al backend:', {
            taskId,
            data: dataToSend,
            status: dataToSend.status
        });

        const response = await axios.put(`${API_URL}/tasks/${taskId}`, dataToSend, {
            headers: {
                'Authorization': `Bearer ${tokenValue}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('Respuesta del backend:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            headers: response.headers
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error detallado del backend:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers,
                message: error.message,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });
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

export const getTasksByProjectId = async (projectId: number): Promise<Task[]> => {
    try {
        const tokenValue = token();
        if (!tokenValue) {
            throw new Error('No hay token de autenticación');
        }

        // Primero obtenemos los usuarios del proyecto
        const usersResponse = await axios.get(`${API_URL}/projects/${projectId}/users`, {
            headers: { 
                'Authorization': `Bearer ${tokenValue}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        console.log('Usuarios del proyecto:', usersResponse.data);

        // Luego obtenemos las tareas
        const url = `${API_URL}/tasks?project_id=${projectId}`;
        console.log('Obteniendo tareas con URL:', url);
        
        const response = await axios.get(url, {
            headers: { 
                'Authorization': `Bearer ${tokenValue}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        
        console.log('Respuesta del servidor:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            headers: response.headers
        });

        let tasks: Task[] = [];
        if (Array.isArray(response.data)) {
            tasks = response.data.filter((task: Task) => task.project_id === projectId);
        } else if (response.data && Array.isArray(response.data.data)) {
            tasks = response.data.data.filter((task: Task) => task.project_id === projectId);
        } else if (response.data && Array.isArray(response.data.tasks)) {
            tasks = response.data.tasks.filter((task: Task) => task.project_id === projectId);
        }

        // Asociamos los usuarios a las tareas
        const tasksWithUsers = tasks.map(task => {
            const assignedUser = usersResponse.data.find((user: any) => user.id === task.user_id);
            return {
                ...task,
                assigned_to: assignedUser || null
            };
        });

        console.log('Tareas procesadas con usuarios:', tasksWithUsers.map(task => ({
            id: task.id,
            title: task.title,
            assigned_to: task.assigned_to,
            user_id: task.user_id
        })));
        
        return tasksWithUsers;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error al obtener tareas del proyecto:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                url: error.config?.url
            });
        }
        throw error;
    }
};
