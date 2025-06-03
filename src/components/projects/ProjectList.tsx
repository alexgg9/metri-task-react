import React, { useState, useEffect, useCallback } from 'react';
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
  Grid,
  GridItem,
  InputGroup,
  InputLeftElement,
  Input,
  Container,
  Spinner
} from '@chakra-ui/react';
import { FiPlus, FiFilter, FiCalendar, FiFlag, FiClock, FiArrowUp } from 'react-icons/fi';
import { getProjects } from '../../services/projectService';
import CreateProjectModal from './CreateProjectModal';
import { Project } from '@/types/project';
import { useAuth } from '../../contexts/AuthContext';
import ProjectListContent from './ProjectListContent';

const ITEMS_PER_PAGE = 8;

const ProjectList: React.FC = () => {
  // 1. Hooks de estado
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // 2. Hooks de Chakra UI
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // 3. Hooks de contexto
  const { user } = useAuth();

  // 4. Callbacks
  const handleProjectCreated = useCallback(async () => {
    setLoading(true);
    const response = await getProjects();
    const userProjects = response.filter(project =>
      project.creator?.id === user?.id ||
      project.users?.some(u => u.id === user?.id) ||
      project.user_id === user?.id
    );
    setAllProjects(userProjects);
    setLoading(false);
  }, [user]);

  // 5. Efectos
  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      if (!user) return;

      try {
        const response = await getProjects();
        const data = response || [];

        const userProjects = data.filter(project => {
          const isCreator = project.creator?.id === user.id;
          const isMember = project.users?.some(u => u.id === user.id);
          const isOwner = project.user_id === user.id;
          return isCreator || isMember || isOwner;
        });

        if (isMounted) {
          setAllProjects(userProjects);
        }
      } catch (error) {
        console.error('Error al obtener proyectos:', error);
        if (isMounted) setAllProjects([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProjects();

    return () => { isMounted = false };
  }, [user]);

  useEffect(() => {
    let filtered = [...allProjects];
    const today = new Date();

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(p => p.priority?.toLowerCase() === priorityFilter.toLowerCase());
    }

    if (dateFilter !== 'all') {
      filtered = filtered.filter(p => {
        const start = p.start_date ? new Date(p.start_date) : null;
        const end = p.end_date ? new Date(p.end_date) : null;

        switch (dateFilter) {
          case 'thisWeek':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return start && start >= weekAgo;
          case 'thisMonth':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            return start && start >= monthAgo;
          case 'overdue':
            return end && end < today;
          default:
            return true;
        }
      });
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        filtered.sort((a, b) =>
          (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) -
          (priorityOrder[b.priority as keyof typeof priorityOrder] || 3)
        );
        break;
    }

    setFilteredProjects(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [allProjects, statusFilter, priorityFilter, dateFilter, sortBy]);

  // 6. Cálculos derivados
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 7. Renderizado condicional
  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <Flex justify="center" align="center" h="50vh">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      </Container>
    );
  }

  // 8. Renderizado principal
  return (
    <Box>
      <Box px={8} py={6}>
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading size="lg">Mis Proyectos</Heading>
            <Button
              leftIcon={<Icon as={FiPlus} />}
              colorScheme="blue"
              onClick={onOpen}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Nuevo Proyecto
            </Button>
          </Flex>

          <Grid templateColumns="repeat(4, 1fr)" gap={4}>
            <GridItem>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiFilter} color="gray.400" />
                </InputLeftElement>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="sm"
                  bg={useColorModeValue('white', 'gray.700')}
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                  borderRadius="lg"
                  pl={8}
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activo</option>
                  <option value="completed">Completado</option>
                  <option value="in progress">En progreso</option>
                </Select>
              </InputGroup>
            </GridItem>

            <GridItem>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiFlag} color="gray.400" />
                </InputLeftElement>
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  size="sm"
                  bg={useColorModeValue('white', 'gray.700')}
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                  borderRadius="lg"
                  pl={8}
                >
                  <option value="all">Todas las prioridades</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </Select>
              </InputGroup>
            </GridItem>

            <GridItem>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiCalendar} color="gray.400" />
                </InputLeftElement>
                <Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  size="sm"
                  bg={useColorModeValue('white', 'gray.700')}
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                  borderRadius="lg"
                  pl={8}
                >
                  <option value="all">Todas las fechas</option>
                  <option value="thisWeek">Esta semana</option>
                  <option value="thisMonth">Este mes</option>
                  <option value="overdue">Vencidos</option>
                </Select>
              </InputGroup>
            </GridItem>

            <GridItem>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiArrowUp} color="gray.400" />
                </InputLeftElement>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  size="sm"
                  bg={useColorModeValue('white', 'gray.700')}
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                  borderRadius="lg"
                  pl={8}
                >
                  <option value="newest">Más recientes</option>
                  <option value="oldest">Más antiguos</option>
                  <option value="name">Nombre</option>
                  <option value="priority">Prioridad</option>
                </Select>
              </InputGroup>
            </GridItem>
          </Grid>
        </VStack>
      </Box>

      <Box px={8} pt={4}>
        {paginatedProjects.length === 0 ? (
          <VStack spacing={6} align="center" justify="center" minH="60vh">
            <Heading size="lg" color={textColor}>
              {allProjects.length === 0 ? 'No tienes proyectos' : 'No hay resultados'}
            </Heading>
            <Text color={textColor} textAlign="center">
              {allProjects.length === 0
                ? 'No tienes ningún proyecto asignado o creado.\nCrea un nuevo proyecto o pide que te asignen uno.'
                : 'No se encontraron proyectos que coincidan con los filtros aplicados.'}
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
        ) : (
          <>
            <ProjectListContent 
              projects={paginatedProjects} 
              loading={loading}
            />
            <Flex justify="center" mt={6} gap={2}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? 'solid' : 'outline'}
                  colorScheme="blue"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </Flex>
          </>
        )}
      </Box>

      <CreateProjectModal isOpen={isOpen} onClose={onClose} onProjectCreated={handleProjectCreated} />
    </Box>
  );
};

export default ProjectList;
