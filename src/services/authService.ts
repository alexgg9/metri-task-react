import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";


axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
    try {
        console.log('Iniciando login...');
        const response = await axios.post(`${API_URL}/login`, { email, password });
        console.log('Respuesta del login:', response.data);
        
        const token = response.data.access_token;
        if (!token) {
            throw new Error('No se recibió el token de acceso');
        }

        localStorage.setItem("token", token);
        console.log('Token guardado en localStorage');

        const userResponse = await axios.get(`${API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Información del usuario obtenida:', userResponse.data);
        
        return {
            ...response.data,
            user: userResponse.data
        };
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

export const logout = async () => {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            await axios.post(`${API_URL}/api/logout`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    } finally {
        // Limpiar el token y cualquier otro dato de sesión
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Limpiar los headers de axios
        delete axios.defaults.headers.common['Authorization'];
        // Forzar una recarga de la página para limpiar el estado
        window.location.href = '/auth';
    }
};
