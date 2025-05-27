import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/userService';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      console.log('Verificando autenticación...');
      const token = localStorage.getItem('token');
      console.log('Token encontrado:', !!token);

      if (!token) {
        console.log('No hay token, usuario no autenticado');
        setUser(null);
        setLoading(false);
        return;
      }

      const userData = await getCurrentUser();
      console.log('Usuario obtenido:', userData);
      
      if (userData) {
        setUser(userData);
        setError(null);
      } else {
        setUser(null);
        setError('No se pudo obtener la información del usuario');
      }
    } catch (err) {
      console.error('Error al verificar autenticación:', err);
      setUser(null);
      setError('Error al verificar la autenticación');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, setUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 