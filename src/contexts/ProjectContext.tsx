import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Project } from '../types/project';
import { getProjectById } from '../services/projectService';

interface ProjectContextType {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  loading: boolean;
  refreshProject: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Función para comparar valores primitivos
const isPrimitive = (value: any): boolean => {
  return value === null || 
         typeof value === 'boolean' || 
         typeof value === 'number' || 
         typeof value === 'string' || 
         typeof value === 'undefined';
};

// Función para comparar fechas
const isDate = (value: any): boolean => {
  return value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)));
};

// Función para normalizar fechas
const normalizeDate = (value: any): string => {
  if (isDate(value)) {
    return new Date(value).toISOString();
  }
  return value;
};

// Función para comparar arrays
const compareArrays = (arr1: any[], arr2: any[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  
  // Ordenar los arrays por id si los elementos tienen id
  const sortById = (a: any, b: any) => {
    if (a.id && b.id) return a.id - b.id;
    return 0;
  };

  const sortedArr1 = [...arr1].sort(sortById);
  const sortedArr2 = [...arr2].sort(sortById);
  
  return sortedArr1.every((item, index) => {
    return deepEqual(item, sortedArr2[index]);
  });
};

// Función para comparar objetos
const compareObjects = (obj1: any, obj2: any): boolean => {
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();

  if (keys1.length !== keys2.length) return false;

  return keys1.every(key => {
    if (!obj2.hasOwnProperty(key)) return false;
    
    // Ignorar campos que no son relevantes para la comparación
    if (key === 'updated_at' || key === 'created_at') return true;
    
    const val1 = obj1[key];
    const val2 = obj2[key];
    
    // Si son fechas, normalizarlas antes de comparar
    if (isDate(val1) && isDate(val2)) {
      return normalizeDate(val1) === normalizeDate(val2);
    }
    
    return deepEqual(val1, val2);
  });
};

// Función principal de comparación profunda
const deepEqual = (value1: any, value2: any): boolean => {
  // Si son el mismo objeto, retornar true
  if (value1 === value2) return true;

  // Si alguno es null o undefined
  if (value1 == null || value2 == null) return value1 === value2;

  // Si son fechas
  if (isDate(value1) && isDate(value2)) {
    return normalizeDate(value1) === normalizeDate(value2);
  }

  // Si son primitivos
  if (isPrimitive(value1) || isPrimitive(value2)) {
    return value1 === value2;
  }

  // Si son arrays
  if (Array.isArray(value1) && Array.isArray(value2)) {
    return compareArrays(value1, value2);
  }

  // Si son objetos
  if (typeof value1 === 'object' && typeof value2 === 'object') {
    return compareObjects(value1, value2);
  }

  return false;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const refreshProject = useCallback(async () => {
    const projectId = location.pathname.split('/').pop();
    if (projectId && !isNaN(Number(projectId))) {
      console.log('Refrescando proyecto:', projectId);
      try {
        setLoading(true);
        const project = await getProjectById(Number(projectId));
        console.log('Datos del proyecto actualizados:', project);
        
        // Forzar la actualización del estado
        setCurrentProject(project);
        console.log('Estado del proyecto actualizado');
      } catch (error) {
        console.error('Error al refrescar el proyecto:', error);
        setCurrentProject(null);
      } finally {
        setLoading(false);
      }
    }
  }, [location.pathname]);

  const fetchProject = async () => {
    const pathSnippets = location.pathname.split('/').filter(Boolean);
    if (pathSnippets[0] === 'projects' && pathSnippets[1] && !isNaN(Number(pathSnippets[1]))) {
      setLoading(true);
      try {
        const projectId = Number(pathSnippets[1]);
        const projectData = await getProjectById(projectId);
        console.log('Proyecto cargado:', projectData);
        setCurrentProject(projectData);
      } catch (error) {
        console.error('Error al cargar el proyecto:', error);
        setCurrentProject(null);
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentProject(null);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [location.pathname]);

  // Función para actualizar el proyecto de manera forzada
  const forceUpdateProject = async (projectId: number) => {
    setLoading(true);
    try {
      const projectData = await getProjectById(projectId);
      console.log('Forzando actualización del proyecto:', projectData);
      setCurrentProject(projectData);
    } catch (error) {
      console.error('Error al forzar la actualización del proyecto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider value={{
      currentProject,
      setCurrentProject,
      loading,
      refreshProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject debe ser usado dentro de un ProjectProvider');
  }
  return context;
}; 