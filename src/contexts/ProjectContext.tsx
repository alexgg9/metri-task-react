import React, { createContext, useContext, useState, useEffect } from 'react';
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

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const fetchProject = async () => {
    const pathSnippets = location.pathname.split('/').filter(Boolean);
    if (pathSnippets[0] === 'projects' && pathSnippets[1] && !isNaN(Number(pathSnippets[1]))) {
      setLoading(true);
      try {
        const projectId = Number(pathSnippets[1]);
        const projectData = await getProjectById(projectId);
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

  const refreshProject = async () => {
    await fetchProject();
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