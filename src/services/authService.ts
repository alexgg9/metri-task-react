import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        const token = response.data.token;
        localStorage.setItem("token", token); 
        return response.data;
    } catch (error) {
        console.error("Error al hacer login:", error);
        throw error; 
    }
};


export const register = async (name: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { name, email, password });
        return response.data;
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        throw error;
    }
};


export const logout = async () => {
    try {
        const token = localStorage.getItem("token");
        await axios.post(`${API_URL}/logout`, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem("token"); 
    } catch (error) {
        console.error("Error al hacer logout:", error);
        throw error;
    }
};
