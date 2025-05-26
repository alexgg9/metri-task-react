import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { getCurrentUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isManager: boolean;
  isMember: boolean;
  hasPermission: (permission: string) => boolean;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      console.log('Iniciando verificación de autenticación...');
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No se encontró token, redirigiendo a login...');
        setLoading(false);
        navigate('/auth');
        return;
      }

      try {
        console.log('Obteniendo datos del usuario...');
        const userData = await getCurrentUser();
        console.log('Usuario obtenido:', userData);
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error('Error en la autenticación:', err);
        setError('Error al cargar el usuario');
        setUser(null);
        localStorage.removeItem('token');
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isMember = user?.role === 'member';

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return true;
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAdmin,
      isManager,
      isMember,
      hasPermission,
      updateUser
    }}>
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