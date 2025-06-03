import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Project } from '../types/project';
import { getProjectById } from '../services/projectService';

interface ProjectContextType {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  loading: boolean;
  refreshProject: () => Promise<void>;
  error: string | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);


const isPrimitive = (value: any): boolean => {
  return value === null || 
         typeof value === 'boolean' || 
         typeof value === 'number' || 
         typeof value === 'string' || 
         typeof value === 'undefined';
};


const isDate = (value: any): boolean => {
  return value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)));
};


const normalizeDate = (value: any): string => {
  if (isDate(value)) {
    return new Date(value).toISOString();
  }
  return value;
};


const compareArrays = (arr1: any[], arr2: any[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  

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


const compareObjects = (obj1: any, obj2: any): boolean => {
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();

  if (keys1.length !== keys2.length) return false;

  return keys1.every(key => {
    if (!obj2.hasOwnProperty(key)) return false;
    

    if (key === 'updated_at' || key === 'created_at') return true;
    
    const val1 = obj1[key];
    const val2 = obj2[key];
    

    if (isDate(val1) && isDate(val2)) {
      return normalizeDate(val1) === normalizeDate(val2);
    }
    
    return deepEqual(val1, val2);
  });
};


const deepEqual = (value1: any, value2: any): boolean => {

  if (value1 === value2) return true;


  if (value1 == null || value2 == null) return value1 === value2;


  if (isDate(value1) && isDate(value2)) {
    return normalizeDate(value1) === normalizeDate(value2);
  }


  if (isPrimitive(value1) || isPrimitive(value2)) {
    return value1 === value2;
  }


  if (Array.isArray(value1) && Array.isArray(value2)) {
    return compareArrays(value1, value2);
  }

  if (typeof value1 === 'object' && typeof value2 === 'object') {
    return compareObjects(value1, value2);
  }

  return false;
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const refreshProject = useCallback(async () => {
    const projectId = location.pathname.split('/').pop();
    if (projectId && !isNaN(Number(projectId))) {
      try {
        setLoading(true);
        setError(null);
        const project = await getProjectById(Number(projectId));
        setCurrentProject(project);
      } catch (error) {
        console.error('Error al refrescar el proyecto:', error);
        setCurrentProject(null);
        setError('No se pudo cargar el proyecto');
        navigate('/404');
      } finally {
        setLoading(false);
      }
    }
  }, [location.pathname, navigate]);

  const fetchProject = async () => {
    const pathSnippets = location.pathname.split('/').filter(Boolean);
    if (pathSnippets[0] === 'projects' && pathSnippets[1]) {
      if (!isNaN(Number(pathSnippets[1]))) {
        setLoading(true);
        setError(null);
        try {
          const projectId = Number(pathSnippets[1]);
          const projectData = await getProjectById(projectId);
          setCurrentProject(projectData);
        } catch (error) {
          console.error('Error al cargar el proyecto:', error);
          setCurrentProject(null);
          setError('No se pudo cargar el proyecto');
          navigate('/404');
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentProject(null);
        setError('ID de proyecto inválido');
        navigate('/404');
      }
    } else {
      setCurrentProject(null);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [location.pathname]);


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
    <ProjectContext.Provider value={{ currentProject, setCurrentProject, loading, refreshProject, error }}>
      {children}
    </ProjectContext.Provider>
  );
}; 