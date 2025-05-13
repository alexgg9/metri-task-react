import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { getProjects } from '../../services/projectService';
import ProjectListContent from './ProjectListContent.tsx';
import { Project } from '@/types/project';

const ProjectListWithNavigation: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await getProjects();
        const projectsData = response || [];
        setProjects(projectsData);
      } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Box padding={4} width="100%">
      <ProjectListContent 
        projects={projects} 
        loading={loading} 
      />
    </Box>
  );
};

export default ProjectListWithNavigation;