import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GridItem,
  Card,
  CardBody,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Progress,
  Button,
  useColorModeValue,
  Box,
  Icon,
  Flex,
  Avatar,
  AvatarGroup,
  Tooltip,
  Divider
} from '@chakra-ui/react';
import { 
  FiArrowRight, 
  FiCalendar, 
  FiClock, 
  FiFlag, 
  FiFolder
} from 'react-icons/fi';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const [displayStatus, setDisplayStatus] = useState(translateStatus(project.status));
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardShadow = useColorModeValue('md', 'dark-lg');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.100', 'gray.600');
  const progressBg = useColorModeValue('gray.100', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

  useEffect(() => {
    if (project.progress === 100 && 
        !['completado', 'completed'].includes(project.status.toLowerCase())) {
      setDisplayStatus('Completado');
    } else if (project.progress < 100 && 
              ['completado', 'completed'].includes(project.status.toLowerCase())) {
      setDisplayStatus('En progreso');
    }
  }, [project.progress, project.status]);

  function translateStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Completado';
      case 'in progress':
        return 'En progreso';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }

  function translatePriority(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completado':
      case 'completed':
        return 'green';
      case 'en progreso':
      case 'in progress':
        return 'blue';
      case 'pendiente':
      case 'pending':
        return 'orange';
      case 'cancelado':
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
      case 'high':
        return 'red';
      case 'media':
      case 'medium':
        return 'orange';
      case 'baja':
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const handleViewDetails = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <GridItem 
      colSpan={{ base: 12, sm: 6, md: 4, lg: 4, xl: 3 }}
      p={3} 
    >
      <Card
        bg={cardBg}
        borderRadius="xl"
        overflow="hidden"
        border="none"
        boxShadow={cardShadow}
        transition="all 0.3s ease"
        _hover={{ 
          transform: 'translateY(-5px)', 
          boxShadow: 'xl',
          borderColor: accentColor
        }}
        position="relative"
        h="100%"
      >
        <Box 
          position="absolute" 
          top={0} 
          left={0} 
          right={0} 
          h="8px" 
          bg={`${getStatusColor(project.status)}.500`} 
        />
        
        <CardBody p={5} pt={6}>
          <VStack spacing={4} align="stretch">
            <Flex justify="space-between" align="center" gap={3}>
              <HStack spacing={3}>
                <Icon as={FiFolder} color={accentColor} boxSize={5} />
                <Heading 
                  size="md" 
                  color={useColorModeValue('gray.700', 'white')}
                  isTruncated
                  maxW="70%"
                >
                  {project.name}
                </Heading>
              </HStack>
              <Badge 
                colorScheme={getStatusColor(project.status)}
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
                textTransform="capitalize"
                ml="auto"
              >
                {displayStatus}
              </Badge>
            </Flex>
            
            <Text 
              color={textColor} 
              fontSize="sm" 
              noOfLines={2}
              minH="40px"
            >
              {project.description}
            </Text>
            
            <Divider borderColor={borderColor} />
            
            <HStack spacing={4} justify="space-between">
              <Tooltip label="Fecha de inicio">
                <Flex align="center">
                  <Icon as={FiCalendar} color={accentColor} mr={1} />
                  <Text fontSize="xs" color={textColor}>
                    {project.start_date ? formatDate(project.start_date) : 'No definida'}
                  </Text>
                </Flex>
              </Tooltip>
              
              <Tooltip label="Fecha límite">
                <Flex align="center">
                  <Icon as={FiClock} color={accentColor} mr={1} />
                  <Text fontSize="xs" color={textColor}>
                    {project.end_date ? formatDate(project.end_date) : 'Sin límite'}
                  </Text>
                </Flex>
              </Tooltip>
            </HStack>
            
            <HStack spacing={4} justify="space-between">
              <Flex align="center">
                <Icon as={FiFlag} color={`${getPriorityColor(project.priority)}.500`} mr={2} />
                <Badge 
                  colorScheme={getPriorityColor(project.priority)}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                >
                  Prioridad: {translatePriority(project.priority)}
                </Badge>
              </Flex>

              {project.users && project.users.length > 0 && (
                <Tooltip label="Miembros del equipo">
                  <AvatarGroup size="xs" max={3}>
                    {project.users.map((member, index) => (
                      <Avatar 
                        key={index} 
                        name={member.name} 
                        src={member.avatar} 
                      />
                    ))}
                  </AvatarGroup>
                </Tooltip>
              )}
            </HStack>
            
            <Box>
              <Flex justify="space-between" mb={1}>
                <Text fontSize="xs" fontWeight="medium" color={textColor}>
                  Progreso
                </Text>
                <Text fontSize="xs" fontWeight="bold" color={accentColor}>
                  {project.progress || 0}%
                </Text>
              </Flex>
              <Progress 
                value={project.progress || 0} 
                size="sm" 
                colorScheme={project.progress === 100 ? "green" : "blue"}
                borderRadius="full"
                bg={progressBg}
              />
            </Box>
            
            <Button 
              rightIcon={<FiArrowRight />}
              colorScheme="blue"
              variant="ghost"
              size="sm"
              borderRadius="lg"
              onClick={() => handleViewDetails(project.id)}
              alignSelf="flex-end"
              _hover={{
                bg: hoverBg,
                color: 'blue.600'
              }}
            >
              Ver detalles
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default ProjectCard;