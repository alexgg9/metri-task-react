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
  Select
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { getProjects } from '../../services/projectService';
import ProjectListContent from './ProjectListContent';
import CreateProjectModal from './CreateProjectModal';
import { Project } from '@/types/project';

const ITEMS_PER_PAGE = 8;

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await getProjects();
      const projectsData = response || [];
      
      // Ordenar proyectos
      let sortedProjects = [...projectsData];
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
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleProjectCreated = () => {
    fetchProjects();
  };

  const paginatedProjects = projects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
          Proyectos
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