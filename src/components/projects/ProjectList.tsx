import React, { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { getProjects } from '../../services/projectService';
import Sidebar from '../Sidebar.tsx';
import Topbar from '../Topbar.tsx';
import ProjectListContent from './ProjectListContent.tsx';
import { Project } from '@/types/project';

const ProjectListWithNavigation: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

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
    <Flex minHeight="100vh">
      {/* Sidebar Component */}
      <Sidebar collapsed={collapsed} />

      {/* Main Layout */}
      <Box 
        flex="1"
        marginLeft={collapsed ? "80px" : "200px"} 
        transition="all 0.2s"
      >
        {/* Topbar Component */}
        <Topbar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />

        {/* Main Content - ProjectList */}
        <Box margin="24px" padding={0} minHeight="280px">
          <ProjectListContent 
            projects={projects} 
            loading={loading} 
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default ProjectListWithNavigation;