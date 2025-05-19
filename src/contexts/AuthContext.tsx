import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { getCurrentUser } from '../services/userService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isManager: boolean;
  isMember: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        setError('Error al cargar el usuario');
        console.error('Error al cargar el usuario:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isMember = user?.role === 'member';

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Permisos básicos para todos los usuarios autenticados
    const basicPermissions = ['view_projects', 'view_tasks', 'view_profile'];
    
    // Permisos específicos por rol
    const rolePermissions = {
      admin: ['*'], // Los administradores tienen todos los permisos
      manager: ['create_project', 'edit_project', 'delete_project', 'assign_tasks'],
      member: ['create_task', 'edit_own_tasks', 'view_own_tasks']
    };

    // Si el usuario es admin, tiene todos los permisos
    if (isAdmin) return true;

    // Verificar permisos básicos
    if (basicPermissions.includes(permission)) return true;

    // Verificar permisos específicos del rol
    const userRolePermissions = rolePermissions[user.role as keyof typeof rolePermissions] || [];
    return userRolePermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAdmin,
      isManager,
      isMember,
      hasPermission
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