import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  HStack,
  VStack,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  useColorModeValue,
  Icon,
  Circle,
  CircularProgress,
  CircularProgressLabel,
  Badge,
  Divider
} from '@chakra-ui/react';
import { 
  FiEdit, 
  FiTrash2, 
  FiCalendar, 
  FiCheckCircle,
  FiClock,
  FiFlag, 
  FiUser, 
  FiUsers,
  FiBarChart2,
  FiList,
  FiGrid,
  FiUsers as FiTeam
} from 'react-icons/fi';
import { Project } from '../../types/project';
import { getProjectById, deleteProject } from '../../services/projectService';
import KanbanBoard from '../kanban/KanbanBoard';

const ProjectDetail: React.FC = () => {
  // Hooks de React Router
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // Hooks de estado
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Hooks de Chakra UI
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const progressBg = useColorModeValue('gray.100', 'gray.600');

  // Efectos
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        const data = await getProjectById(Number(projectId));
        setProject(data);
      } catch (error) {
        console.error('Error al cargar el proyecto:', error);
        toast({
          title: 'Error',
          description: 'No se pudo cargar el proyecto',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, toast]);

  const handleEditProject = () => {
    if (project) {
      navigate(`/projects/${project.id}/edit`);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    
    try {
      await deleteProject(project.id);
      toast({
        title: 'Éxito',
        description: 'Proyecto eliminado correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/projects');
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el proyecto',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <Flex justify="center" align="center" h="50vh">
          <Spinner size="xl" thickness="4px" color="blue.500" />
        </Flex>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxW="container.xl" py={10}>
        <Text>No se encontró el proyecto</Text>
      </Container>
    );
  }

  const getStatusColor = (status: string | undefined | null) => {
    if (!status) return 'gray';
    
    switch (status.toLowerCase()) {
      case 'completed':
      case 'completado':
        return 'green';
      case 'in progress':
      case 'en progreso':
        return 'blue';
      case 'pending':
      case 'pendiente':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority: string | undefined | null) => {
    if (!priority) return 'gray';
    
    switch (priority.toLowerCase()) {
      case 'high':
      case 'alta':
        return 'red';
      case 'medium':
      case 'media':
        return 'orange';
      case 'low':
      case 'baja':
        return 'green';
      default:
        return 'gray';
    }
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
    <Container maxW="container.xl" py={8}>
      <Card bg={cardBg} boxShadow="sm" borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
        <CardBody>
          <Flex justify="space-between" align="center" mb={8}>
            <Heading as="h1" size="xl" color={textColor}>{project.name}</Heading>
            <HStack spacing={3}>
              <Button 
                leftIcon={<FiEdit />} 
                colorScheme="blue" 
                variant="outline"
                onClick={handleEditProject}
                _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                Editar
              </Button>
              <Button 
                leftIcon={<FiTrash2 />} 
                colorScheme="red" 
                variant="outline"
                onClick={onOpen}
                _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                Eliminar
              </Button>
            </HStack>
          </Flex>

          <Tabs variant="enclosed" colorScheme="blue" isLazy>
            <TabList borderBottomWidth="1px" borderColor={borderColor}>
              <Tab 
                _selected={{ color: 'blue.500', borderColor: 'blue.500' }}
                fontWeight="medium"
              >
                <HStack spacing={2}>
                  <Icon as={FiBarChart2} />
                  <Text>Información</Text>
                </HStack>
              </Tab>
              <Tab 
                _selected={{ color: 'blue.500', borderColor: 'blue.500' }}
                fontWeight="medium"
              >
                <HStack spacing={2}>
                  <Icon as={FiList} />
                  <Text>Tareas</Text>
                </HStack>
              </Tab>
              <Tab 
                _selected={{ color: 'blue.500', borderColor: 'blue.500' }}
                fontWeight="medium"
              >
                <HStack spacing={2}>
                  <Icon as={FiGrid} />
                  <Text>Kanban</Text>
                </HStack>
              </Tab>
              <Tab 
                _selected={{ color: 'blue.500', borderColor: 'blue.500' }}
                fontWeight="medium"
              >
                <HStack spacing={2}>
                  <Icon as={FiTeam} />
                  <Text>Equipo</Text>
                </HStack>
              </Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
                  <GridItem>
                    <VStack align="stretch" spacing={6}>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={2}>Descripción</Text>
                        <Text color={textColor}>{project.description}</Text>
                      </Box>

                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={4}>Progreso</Text>
                        <Flex align="center" gap={4}>
                          <CircularProgress
                            value={project.progress || 0}
                            color={project.progress === 100 ? "green.500" : "blue.500"}
                            size="120px"
                            thickness="8px"
                            trackColor={progressBg}
                          >
                            <CircularProgressLabel>
                              <VStack spacing={0}>
                                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                  {project.progress || 0}%
                                </Text>
                                <Text fontSize="xs" color="gray.500">Completado</Text>
                              </VStack>
                            </CircularProgressLabel>
                          </CircularProgress>
                          <VStack align="start" spacing={2}>
                            <HStack>
                              <Circle size="3" bg="blue.500" />
                              <Text fontSize="sm">En progreso</Text>
                            </HStack>
                            <HStack>
                              <Circle size="3" bg="green.500" />
                              <Text fontSize="sm">Completado</Text>
                            </HStack>
                            <HStack>
                              <Circle size="3" bg="gray.300" />
                              <Text fontSize="sm">Pendiente</Text>
                            </HStack>
                          </VStack>
                        </Flex>
                      </Box>
                    </VStack>
                  </GridItem>
                  
                  <GridItem>
                    <Card variant="outline" borderColor={borderColor}>
                      <CardHeader pb={2}>
                        <Heading size="md" color={textColor}>Información del Proyecto</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack align="stretch" spacing={4}>
                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={FiCheckCircle} color={`${getStatusColor(project.status)}.500`} />
                              <Text fontSize="sm">Estado</Text>
                            </HStack>
                            <Badge
                              colorScheme={getStatusColor(project.status)}
                              variant="subtle"
                              px={2}
                              py={0.5}
                              borderRadius="full"
                            >
                              {project.status === 'completed' ? 'Completado' : 
                               project.status === 'in progress' ? 'En progreso' : 'Activo'}
                            </Badge>
                          </HStack>

                          <Divider />

                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={FiFlag} color={`${getPriorityColor(project.priority)}.500`} />
                              <Text fontSize="sm">Prioridad</Text>
                            </HStack>
                            <Badge
                              colorScheme={getPriorityColor(project.priority)}
                              variant="subtle"
                              px={2}
                              py={0.5}
                              borderRadius="full"
                            >
                              {project.priority === 'high' ? 'Alta' :
                               project.priority === 'medium' ? 'Media' : 'Baja'}
                            </Badge>
                          </HStack>

                          <Divider />

                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={FiCalendar} color="blue.500" />
                              <Text fontSize="sm">Inicio</Text>
                            </HStack>
                            <Text fontSize="sm" color={textColor}>
                              {formatDate(project.start_date)}
                            </Text>
                          </HStack>

                          {project.end_date && (
                            <>
                              <Divider />
                              <HStack justify="space-between">
                                <HStack>
                                  <Icon as={FiClock} color="blue.500" />
                                  <Text fontSize="sm">Fin</Text>
                                </HStack>
                                <Text fontSize="sm" color={textColor}>
                                  {formatDate(project.end_date)}
                                </Text>
                              </HStack>
                            </>
                          )}

                          <Divider />

                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={FiUser} color="blue.500" />
                              <Text fontSize="sm">Creador</Text>
                            </HStack>
                            <Text fontSize="sm" color={textColor}>
                              {project.creator?.name || 'Usuario'}
                            </Text>
                          </HStack>

                          <Divider />

                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={FiUsers} color="blue.500" />
                              <Text fontSize="sm">Tareas</Text>
                            </HStack>
                            <Badge
                              colorScheme="blue"
                              variant="subtle"
                              px={2}
                              py={0.5}
                              borderRadius="full"
                            >
                              {project.tasks?.length || 0}
                            </Badge>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                </Grid>
              </TabPanel>
              
              <TabPanel>
                <Text>Lista de tareas del proyecto</Text>
              </TabPanel>
              
              <TabPanel>
                <KanbanBoard projectId={Number(projectId)} />
              </TabPanel>
              
              <TabPanel>
                <Text>Miembros del equipo del proyecto</Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent 
          bg={cardBg} 
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="xl"
        >
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
            <HStack spacing={2}>
              <Icon as={FiTrash2} color="red.500" />
              <Text>Confirmar eliminación</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            ¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.
          </ModalBody>
          <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
            <Button 
              variant="ghost" 
              mr={3} 
              onClick={onClose}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
            >
              Cancelar
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleDeleteProject}
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProjectDetail;