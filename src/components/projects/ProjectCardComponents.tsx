import React from 'react';
import { 
  Box, 
  Flex, 
  Avatar, 
  Tag, 
  Text, 
  Heading, 
  Progress,
  useColorModeValue
} from '@chakra-ui/react';
import { FiFolder, FiFileText, FiUsers } from 'react-icons/fi';
import { Project } from '@/types/project';

interface ProjectComponentProps {
  project: Project;
}

export const ProjectCardHeader: React.FC<ProjectComponentProps> = ({ project }) => {
  const primaryColor = useColorModeValue('blue.500', 'blue.300');
  
  return (
    <Flex align="center" mb={4}>
      <Avatar 
        icon={<FiFolder />} 
        bg={primaryColor}
        color="white"
        boxShadow="sm"
        size="md"
      />
      <Box ml={3} flex={1} overflow="hidden">
        <Heading 
          as="h3" 
          size="sm" 
          fontWeight="600"
          noOfLines={1}
        >
          {project.name}
        </Heading>
        <Text fontSize="xs" color="gray.500">
          {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Fecha no definida'} - 
          {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Fecha no definida'}
        </Text>
      </Box>
    </Flex>
  );
};

export const ProjectCardDescription: React.FC<ProjectComponentProps> = ({ project }) => (
  <Box position="relative" h="60px" mb={4} overflow="hidden">
    <Text 
      fontSize="sm"
      color="gray.600"
      noOfLines={3}
    >
      {project.description}
    </Text>
    <Box 
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      height="20px"
      bgGradient="linear(to-t, white, transparent)"
      _dark={{ bgGradient: "linear(to-t, gray.700, transparent)" }}
    />
  </Box>
);

export const ProjectCardTags: React.FC<ProjectComponentProps> = ({ project }) => {
  const tagBgTask = useColorModeValue('blue.50', 'blue.900');
  const tagBgComplete = useColorModeValue('green.50', 'green.900');
  
  return (
    <Flex justify="space-between" mb={4} gap={2}>
      <Tag 
        size="sm"
        borderRadius="full"
        px={3}
        py={1}
        bg={tagBgTask}
        color="blue.500"
      >
        <Box as={FiUsers} mr={1} />
        Tareas: {project.tasks ? project.tasks.length : 0}
      </Tag>
      <Tag 
        size="sm"
        borderRadius="full"
        px={3}
        py={1}
        bg={tagBgComplete}
        color="green.500"
      >
        <Box as={FiFileText} mr={1} />
        Completadas: {project.tasks ? project.tasks.filter(task => task.status === 'completed').length : 0}
      </Tag>
    </Flex>
  );
};

export const ProjectCardStatus: React.FC<ProjectComponentProps> = ({ project }) => {
  // Colores para estados
  const statusColors = {
    completed: { bg: useColorModeValue('green.50', 'green.900'), color: 'green.500' },
    'in progress': { bg: useColorModeValue('blue.50', 'blue.900'), color: 'blue.500' },
    active: { bg: useColorModeValue('yellow.50', 'yellow.900'), color: 'yellow.500' }
  };
  
  const priorityColors = {
    high: { 
      bg: useColorModeValue('red.50', 'red.900'), 
      color: 'red.500',
      shadow: useColorModeValue('0 0 8px rgba(229, 62, 62, 0.6)', '0 0 8px rgba(254, 178, 178, 0.6)')
    },
    medium: { 
      bg: useColorModeValue('yellow.50', 'yellow.900'), 
      color: 'yellow.500',
      shadow: useColorModeValue('0 0 8px rgba(236, 201, 75, 0.6)', '0 0 8px rgba(254, 240, 138, 0.6)')
    },
    low: { 
      bg: useColorModeValue('blue.50', 'blue.900'), 
      color: 'blue.500',
      shadow: useColorModeValue('0 0 8px rgba(66, 153, 225, 0.6)', '0 0 8px rgba(144, 205, 244, 0.6)')
    }
  };
  
  const status = project.status || 'active';
  const priority = project.priority || 'low';
  
  return (
    <Flex justify="space-between" mb={4} gap={2}>
      <Tag 
        size="sm"
        borderRadius="full"
        px={3}
        py={1}
        bg={statusColors[status].bg}
        color={statusColors[status].color}
      >
        <Box as="span" w="6px" h="6px" borderRadius="full" bg="currentColor" mr={1} />
        {status === 'in progress' ? 'En progreso' :
         status === 'completed' ? 'Completado' : 'Activo'}
      </Tag>
      
      <Tag 
        size="sm"
        borderRadius="full"
        px={3}
        py={1}
        bg={priorityColors[priority].bg}
        color={priorityColors[priority].color}
        boxShadow={priorityColors[priority].shadow}
        transition="all 0.2s ease-in-out"
        _hover={{
          boxShadow: priorityColors[priority].shadow.replace('8px', '12px'),
          transform: 'scale(1.05)'
        }}
      >
        <Box as="span" w="6px" h="6px" borderRadius="full" bg="currentColor" mr={1} />
        {priority === 'high' ? 'Alta' :
         priority === 'medium' ? 'Media' : 'Baja'}
      </Tag>
    </Flex>
  );
};

export const ProjectCardProgress: React.FC<ProjectComponentProps> = ({ project }) => {
  const progressBg = useColorModeValue('gray.100', 'gray.700');
  const progressValue = project.tasks && project.tasks.length > 0 
    ? (project.tasks.filter(task => task.status === 'completed').length / project.tasks.length * 100)
    : project.progress || 0;
  
  return (
    <Box mb={4}>
      <Flex justify="space-between" align="center" mb={1}>
        <Text fontSize="xs" color="gray.500">Progreso del proyecto</Text>
        <Text fontSize="xs" fontWeight="bold">{Math.round(progressValue)}%</Text>
      </Flex>
      <Progress 
        value={progressValue} 
        size="xs" 
        borderRadius="full"
        bg={progressBg}
        colorScheme="blue"
      />
    </Box>
  );
};