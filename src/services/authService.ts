import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        console.log("Login exitoso:", response.data);
        const token = response.data.access_token;
        localStorage.setItem("token", token); 
        return response.data;
    } catch (error) {
        console.error("Error al hacer login:", error);
        throw error; 
    }
};


export const register = async (name: string, email: string, password: string, role: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { name, email, password, role });
        return response.data;
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        throw error;
    }
};

export const getUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("No token found");
      }
  
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
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
