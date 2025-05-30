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

export const updateProject = async (id: number, data: Partial<Project>): Promise<Project> => {
  const res = await axios.put(`${API_URL}/projects/${id}`, data, authHeader());
  return res.data;
};

export const deleteProject = async (id: number) => {
  const res = await axios.delete(`${API_URL}/projects/${id}`, authHeader());
  return res.data;
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
