import React from 'react';
import { 
  Box, 
  Center, 
  Text, 
  Heading, 
  Grid, 
  Spinner,
  useColorModeValue
} from '@chakra-ui/react';
import { FiFolder } from 'react-icons/fi';
import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';

interface ProjectListContentProps {
  projects: Project[];
  loading: boolean;
}

const ProjectListContent: React.FC<ProjectListContentProps> = ({ projects, loading }) => {
  const spinnerColor = useColorModeValue('blue.500', 'blue.300');
  const emptyBg = useColorModeValue('white', 'gray.700');
  
  // Mostrar el estado de carga con un spinner de Chakra UI
  if (loading) {
    return (
      <Center h="300px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color={spinnerColor}
          size="xl"
        />
      </Center>
    );
  }

  // Mostrar mensaje cuando no hay proyectos
  if (projects.length === 0) {
    return (
      <Center 
        h="300px" 
        bg={emptyBg} 
        borderRadius="xl" 
        boxShadow="sm"
      >
        <Box textAlign="center">
          <Box 
            as={FiFolder} 
            fontSize="48px" 
            color="gray.400" 
            mb="4"
          />
          <Heading size="md" mb="2" color="gray.500">
            No tienes proyectos
          </Heading>
          <Text color="gray.400">
            Crea un nuevo proyecto para comenzar
          </Text>
        </Box>
      </Center>
    );
  }

  // Mostrar la lista de proyectos
  return (
    <Grid 
      templateColumns="repeat(12, 1fr)" 
      gap={4}
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </Grid>
  );
};

export default ProjectListContent;