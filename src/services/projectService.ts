import axios from "axios";
import { Project } from "../types/project";
import { Task } from "../types/task";
import { User } from "../types/user";
import { getCurrentUser } from "./userService";

const API_URL = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const getProjects = async (): Promise<Project[]> => {
  const res = await axios.get(`${API_URL}/projects`, authHeader());
  return res.data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const res = await axios.get(`${API_URL}/projects/${id}`, authHeader());
  return res.data;
};

export const createProject = async (data: Partial<Project>): Promise<Project> => {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("Usuario no autenticado");
  }

  const res = await axios.post(
    `${API_URL}/projects`,
    {
      ...data,
      user_id: user.id,
      start_date: new Date(data.start_date!).toISOString().split("T")[0],
      end_date: new Date(data.end_date!).toISOString().split("T")[0],
    },
    authHeader()
  );
  return res.data;
};

export const updateProject = async (id: number, projectData: Partial<Project>): Promise<Project> => {
  try {
    const tokenValue = getToken();
    if (!tokenValue) {
      throw new Error('No hay token de autenticación');
    }

    // Obtener el usuario actual para asegurar que tenemos el ID correcto
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('No se pudo obtener la información del usuario');
    }

    // Obtener el proyecto actual para verificar permisos
    const currentProject = await getProjectById(id);
    if (!currentProject) {
      throw new Error('No se pudo obtener la información del proyecto');
    }

    // Verificar si el usuario tiene permisos
    const isAdmin = currentUser.role === 'admin';
    const isManager = currentUser.role === 'manager';
    const isCreator = currentProject.user_id === currentUser.id;
    const isProjectMember = currentProject.users?.some(u => u.id === currentUser.id);

    console.log('Verificación de permisos:', {
      user: {
        id: currentUser.id,
        role: currentUser.role,
        email: currentUser.email
      },
      project: {
        id: currentProject.id,
        creator_id: currentProject.user_id,
        name: currentProject.name
      },
      permissions: {
        isAdmin,
        isManager,
        isCreator,
        isProjectMember
      },
      token: tokenValue.substring(0, 20) + '...'
    });

    if (!isAdmin && !isManager && !isCreator && !isProjectMember) {
      throw new Error('No tienes permisos para editar este proyecto');
    }

    // Formatear las fechas si existen
    const formattedData = {
      ...projectData,
      start_date: projectData.start_date ? new Date(projectData.start_date).toISOString().split('T')[0] : undefined,
      end_date: projectData.end_date ? new Date(projectData.end_date).toISOString().split('T')[0] : undefined,
      user_id: currentUser.id,
      progress: projectData.progress || 0,
      status: projectData.status || 'pending',
      priority: projectData.priority || 'medium'
    };

    console.log('Enviando datos al backend:', {
      url: `${API_URL}/projects/${id}`,
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer [TOKEN]',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: formattedData
    });

    const response = await axios.put(`${API_URL}/projects/${id}`, formattedData, {
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

    // Verificar si la respuesta es válida
    if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
      console.log('La respuesta no contiene datos válidos, obteniendo el proyecto actualizado...');
      const updatedProject = await getProjectById(id);
      console.log('Proyecto actualizado obtenido:', updatedProject);
      return updatedProject;
    }

    // Si la respuesta es un objeto Project, devolverlo directamente
    if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data;
    }

    // Si llegamos aquí, algo salió mal
    throw new Error('La respuesta del servidor no tiene el formato esperado');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error detallado del backend:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: {
            ...error.config?.headers,
            Authorization: 'Bearer [TOKEN]'
          },
          data: error.config?.data
        }
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        const errorMessage = error.response?.data?.message || 'No tienes permisos para editar este proyecto';
        throw new Error(errorMessage);
      }

      if (error.response?.status === 422) {
        throw new Error(error.response.data.message || 'Error de validación al actualizar el proyecto');
      }

      throw new Error(error.response?.data?.message || 'Error al actualizar el proyecto');
    }
    throw error;
  }
};

export const deleteProject = async (projectId: number): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Obtener el usuario actual para verificar permisos
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('No se pudo obtener la información del usuario');
    }

    // Obtener el proyecto actual para verificar permisos
    const currentProject = await getProjectById(projectId);
    if (!currentProject) {
      throw new Error('No se pudo obtener la información del proyecto');
    }

    // Verificar si el usuario tiene permisos
    const isAdmin = currentUser.role === 'admin';
    const isManager = currentUser.role === 'manager';
    const isCreator = currentProject.user_id === currentUser.id;

    console.log('Verificación de permisos para eliminar:', {
      user: {
        id: currentUser.id,
        role: currentUser.role,
        email: currentUser.email
      },
      project: {
        id: currentProject.id,
        creator_id: currentProject.user_id,
        name: currentProject.name
      },
      permissions: {
        isAdmin,
        isManager,
        isCreator
      }
    });

    if (!isAdmin && !isManager && !isCreator) {
      throw new Error('No tienes permisos para eliminar este proyecto');
    }

    const response = await axios.delete(`${API_URL}/projects/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        user_id: currentUser.id,
        token: token,
        project_id: projectId,
        creator_id: currentProject.user_id,
        user_role: currentUser.role
      }
    });

    if (response.status === 200 || response.status === 204) {
      return;
    } else {
      throw new Error('Error al eliminar el proyecto');
    }
  } catch (error) {
    console.error('Error en deleteProject:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para eliminar este proyecto');
      }
      throw new Error(error.response?.data?.message || 'Error al eliminar el proyecto');
    }
    throw error;
  }
};

export const getProjectTasks = async (projectId: number): Promise<Task[]> => {
  const res = await axios.get(`${API_URL}/projects/${projectId}/tasks`, authHeader());
  return res.data;
};

// Funciones para gestionar usuarios del proyecto
export const getProjectUsers = async (projectId: number): Promise<User[]> => {
  const res = await axios.get(`${API_URL}/projects/${projectId}/users`, authHeader());
  return res.data;
};

export const addUserToProject = async (projectId: number, userId: number): Promise<Project> => {
  const res = await axios.post(
    `${API_URL}/projects/${projectId}/users`,
    { user_id: userId },
    authHeader()
  );
  return res.data;
};

export const removeUserFromProject = async (projectId: number, userId: number): Promise<Project> => {
  const res = await axios.delete(
    `${API_URL}/projects/${projectId}/users/${userId}`,
    authHeader()
  );
  return res.data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const res = await axios.get(`${API_URL}/users`, authHeader());
  return res.data;
};
