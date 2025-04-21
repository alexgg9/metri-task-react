import { User } from "../types/user";

const API = import.meta.env.VITE_API_URL;

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const token = localStorage.getItem("token");
        const response = await API.get("/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener el usuario autenticado:", error);
        return null;
    }
};