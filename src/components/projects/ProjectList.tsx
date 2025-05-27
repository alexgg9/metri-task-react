import React, { useState, useEffect } from 'react';
import {
  Box, 
  Button,
  HStack, 
  useDisclosure,
  useColorModeValue,
  Text,
  Icon,
  Flex,
  Select,
  VStack,
  Heading,
  Center
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { getProjects } from '../../services/projectService';
import ProjectListContent from './ProjectListContent';
import CreateProjectModal from './CreateProjectModal';
import { Project } from '@/types/project';
import { useAuth } from '../../contexts/AuthContext';

const ITEMS_PER_PAGE = 8;

const ProjectList: React.FC = () => {
  // 1. Hooks de estado
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');

  // 2. Hooks de Chakra UI
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // 3. Hooks de contexto
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      if (!user) return;
      
      try {
        const response = await getProjects();
        if (!isMounted) return;

        const projectsData = response || [];
        
        // Filtrar proyectos del usuario actual
        const userProjects = projectsData.filter(project => {
          const isCreator = project.creator?.id === user.id;
          const isMember = project.users?.some(u => u.id === user.id);
          const isOwner = project.user_id === user.id;
          return isCreator || isMember || isOwner;
        });
        
        // Ordenar proyectos
        let sortedProjects = [...userProjects];
        switch (sortBy) {
          case 'newest':
            sortedProjects.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
            break;
          case 'oldest':
            sortedProjects.sort((a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime());
            break;
          case 'name':
            sortedProjects.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'priority':
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            sortedProjects.sort((a, b) => 
              (priorityOrder[a.priority as keyof typeof priorityOrder] || 2) - 
              (priorityOrder[b.priority as keyof typeof priorityOrder] || 2)
            );
            break;
        }

        setProjects(sortedProjects);
        setTotalPages(Math.ceil(sortedProjects.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        if (isMounted) {
          setProjects([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [user, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleProjectCreated = async () => {
    setLoading(true);
    try {
      const response = await getProjects();
      const projectsData = response || [];
      
      const userProjects = projectsData.filter(project => {
        const isCreator = project.creator?.id === user?.id;
        const isMember = project.users?.some(u => u.id === user?.id);
        const isOwner = project.user_id === user?.id;
        return isCreator || isMember || isOwner;
      });
      
      setProjects(userProjects);
      setTotalPages(Math.ceil(userProjects.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error al actualizar los proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  const paginatedProjects = projects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!loading && projects.length === 0) {
    return (
      <Box p={8}>
        <VStack spacing={6} align="center" justify="center" minH="60vh">
          <Heading size="lg" color={textColor}>
            No tienes proyectos
          </Heading>
          <Text color={textColor} textAlign="center">
            No tienes ningún proyecto asignado o creado.
            <br />
            Crea un nuevo proyecto o pide que te asignen a uno existente.
          </Text>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            size="lg"
            onClick={onOpen}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            transition="all 0.2s"
          >
            Crear Proyecto
          </Button>
        </VStack>

        <CreateProjectModal
          isOpen={isOpen}
          onClose={onClose}
          onProjectCreated={handleProjectCreated}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Flex 
        justify="space-between" 
        align="center" 
        mb={6}
        p={4}
        bg={bgColor}
        borderRadius="xl"
        boxShadow="sm"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.700', 'white')}>
          Mis Proyectos
        </Text>
        <HStack spacing={4}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="sm"
            width="200px"
            bg={useColorModeValue('gray.50', 'gray.700')}
            borderColor={borderColor}
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="name">Nombre</option>
            <option value="priority">Prioridad</option>
          </Select>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            size="sm"
            onClick={onOpen}
            _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            Nuevo Proyecto
          </Button>
        </HStack>
      </Flex>

      <ProjectListContent 
        projects={paginatedProjects} 
        loading={loading} 
      />

      {!loading && projects.length > 0 && (
        <Flex justify="center" mt={6} gap={2}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => handlePageChange(page)}
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              {page}
            </Button>
          ))}
        </Flex>
      )}

      <CreateProjectModal
        isOpen={isOpen}
        onClose={onClose}
        onProjectCreated={handleProjectCreated}
      />
    </Box>
  );
};

export default ProjectList;