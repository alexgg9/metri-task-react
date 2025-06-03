import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../../types/user';
import { Project } from '../../types/project';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Spinner,
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
  CircularProgress,
  CircularProgressLabel,
  Badge,
  Divider,
  SimpleGrid,
  Avatar,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiCheckCircle,
  FiClock,
  FiFlag, 
  FiUser, 
  FiUsers,
  FiBarChart2,
  FiGrid,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiUserPlus
} from 'react-icons/fi';
import { getProjectById, deleteProject } from '../../services/projectService';
import KanbanBoard from '../kanban/KanbanBoard';
import { useProject } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';
import ProjectUsersModal from './ProjectUsersModal';
import EditProjectModal from './EditProjectModal';

const ProjectDetails: React.FC = () => {
  // 1. Hooks de React Router
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // 2. Hooks de estado
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Hooks de Chakra UI
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const progressBg = useColorModeValue('gray.100', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const { isOpen: isUsersModalOpen, onOpen: onUsersModalOpen, onClose: onUsersModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();

  // 4. Hooks de contexto
  const { currentProject, loading, refreshProject } = useProject();
  const { user } = useAuth();

  // 5. Cálculos derivados
  const isProjectCreator = user && currentProject && (currentProject.creator?.id === user.id || currentProject.user_id === user.id);
  const isAdmin = user?.role === 'admin';

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

  const handleDeleteProject = async () => {
    if (!projectId) return;

    try {
      await deleteProject(Number(projectId));
      toast({
        title: 'Proyecto eliminado',
        description: 'El proyecto ha sido eliminado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/projects');
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo eliminar el proyecto',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleProjectUpdated = async (updatedProject: Project) => {
    try {
      await refreshProject();
      toast({
        title: "Proyecto actualizado",
        description: "Los cambios se han guardado correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al actualizar el proyecto:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el proyecto",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (projectId) {
      refreshProject();
    }
  }, [projectId, refreshProject]);

  const renderMemberAvatar = (member: User) => (
    <Avatar
      size="sm"
      name={member.name}
      src={member.avatar || undefined}
      bg={useColorModeValue('gray.100', 'gray.600')}
    />
  );

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <Center>
          <Spinner size="xl" color="blue.500" />
        </Center>
      </Container>
    );
  }

  if (!currentProject) {
    return (
      <Container maxW="container.xl" py={10}>
        <Center>
          <Text>No se encontró el proyecto</Text>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Card bg={cardBg} borderRadius="xl" boxShadow="xl">
        <CardBody>
          <Flex justify="space-between" align="center" mb={8}>
            <Heading as="h1" size="xl" color={textColor}>{currentProject.name}</Heading>
            {(isProjectCreator || isAdmin) && (
              <HStack spacing={2}>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<FiMoreVertical />}
                    variant="ghost"
                    size="sm"
                  >
                    Acciones
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FiEdit2 />} onClick={() => setIsEditModalOpen(true)}>
                      Editar Proyecto
                    </MenuItem>
                    <MenuItem icon={<FiTrash2 />} onClick={() => onDeleteModalOpen()} color="red.500">
                      Eliminar Proyecto
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            )}
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
                  <Icon as={FiGrid} />
                  <Text>Kanban</Text>
                </HStack>
              </Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
                  <GridItem>
                    <VStack align="stretch" spacing={8}>
                      <Box>
                        <Heading size="lg" color={textColor} mb={6}>{currentProject.name}</Heading>
                        <Text color={textColor} fontSize="md" mb={6}>{currentProject.description}</Text>
                        
                        <Box position="relative" mb={2}>
                          <Box
                            h="6px"
                            w="full"
                            bg={progressBg}
                            borderRadius="full"
                            overflow="hidden"
                          >
                            <Box
                              h="full"
                              w={`${currentProject.progress || 0}%`}
                              bg={currentProject.progress === 100 ? "green.500" : "blue.500"}
                              transition="width 0.3s ease"
                              borderRadius="full"
                            />
                          </Box>
                          <Flex justify="space-between" mt={2}>
                            <Text fontSize="sm" color="gray.500">Progreso</Text>
                            <Text fontSize="sm" fontWeight="medium" color={textColor}>
                              {currentProject.progress || 0}%
                            </Text>
                          </Flex>
                        </Box>
                      </Box>

                      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6}>
                        <Box
                          p={4}
                          bg={useColorModeValue('white', 'gray.700')}
                          borderRadius="lg"
                          borderWidth="1px"
                          borderColor={borderColor}
                          _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                          transition="all 0.2s"
                        >
                          <VStack align="start" spacing={2}>
                            <HStack>
                              <Icon as={FiCheckCircle} color="blue.500" />
                              <Text fontSize="sm" color="gray.500">Completadas</Text>
                            </HStack>
                            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                              {currentProject.tasks?.filter(task => task.status === 'completed').length || 0}
                            </Text>
                          </VStack>
                        </Box>

                        <Box
                          p={4}
                          bg={useColorModeValue('white', 'gray.700')}
                          borderRadius="lg"
                          borderWidth="1px"
                          borderColor={borderColor}
                          _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                          transition="all 0.2s"
                        >
                          <VStack align="start" spacing={2}>
                            <HStack>
                              <Icon as={FiClock} color="orange.500" />
                              <Text fontSize="sm" color="gray.500">En Progreso</Text>
                            </HStack>
                            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                              {currentProject.tasks?.filter(task => task.status === 'in progress').length || 0}
                            </Text>
                          </VStack>
                        </Box>

                        <Box
                          p={4}
                          bg={useColorModeValue('white', 'gray.700')}
                          borderRadius="lg"
                          borderWidth="1px"
                          borderColor={borderColor}
                          _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                          transition="all 0.2s"
                        >
                          <VStack align="start" spacing={2}>
                            <HStack>
                              <Icon as={FiFlag} color={`${getPriorityColor(currentProject.priority)}.500`} />
                              <Text fontSize="sm" color="gray.500">Prioridad</Text>
                            </HStack>
                            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                              {currentProject.priority === 'high' ? 'Alta' :
                               currentProject.priority === 'medium' ? 'Media' : 'Baja'}
                            </Text>
                          </VStack>
                        </Box>
                      </SimpleGrid>

                      <Box>
                        <Flex justify="space-between" align="center" mb={4}>
                          <Text fontSize="lg" fontWeight="medium" color={textColor}>Equipo del Proyecto</Text>
                          {(isProjectCreator || isAdmin) && (
                            <Button
                              leftIcon={<Icon as={FiUserPlus} />}
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              onClick={onUsersModalOpen}
                            >
                              Añadir Miembros
                            </Button>
                          )}
                        </Flex>
                        <VStack spacing={6}>
                          {/* Manager del Proyecto */}
                          <Box
                            p={6}
                            bg={useColorModeValue('white', 'gray.700')}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={borderColor}
                            w="full"
                            _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                            transition="all 0.2s"
                          >
                            <VStack align="stretch" spacing={4}>
                              <Text fontSize="sm" fontWeight="medium" color="gray.500">
                                Manager del Proyecto
                              </Text>
                              <Flex align="center" gap={4}>
                                <Avatar
                                  size="lg"
                                  name={currentProject.creator?.name || 'Usuario'}
                                  src={currentProject.creator?.avatar}
                                  bg="blue.500"
                                />
                                <VStack align="start" spacing={1}>
                                  <Text fontSize="lg" color={textColor} fontWeight="medium">
                                    {currentProject.creator?.name || 'Usuario'}
                                  </Text>
                                  <Text fontSize="sm" color="gray.500">
                                    {currentProject.creator?.email || 'No disponible'}
                                  </Text>
                                </VStack>
                                <Badge
                                  ml="auto"
                                  colorScheme="blue"
                                  variant="subtle"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                >
                                  Manager
                                </Badge>
                              </Flex>
                            </VStack>
                          </Box>

                          {/* Miembros del Equipo */}
                          <Box
                            p={6}
                            bg={useColorModeValue('white', 'gray.700')}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={borderColor}
                            w="full"
                          >
                            <VStack align="stretch" spacing={4}>
                              <Flex justify="space-between" align="center">
                                <Text fontSize="sm" fontWeight="medium" color="gray.500">
                                  Miembros del Equipo
                                </Text>
                                <Badge
                                  colorScheme="purple"
                                  variant="subtle"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                >
                                  {currentProject.users?.length || 0} miembros
                                </Badge>
                              </Flex>
                              <Divider />
                              {currentProject.users && currentProject.users.length > 0 ? (
                                <Box>
                                  <Text fontSize="sm" color={textColor} mb={2}>
                                    Miembros del equipo
                                  </Text>
                                  <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                                    {currentProject.users.map((user) => (
                                      <Flex
                                        key={user.id}
                                        align="center"
                                        p={2}
                                        borderRadius="md"
                                        _hover={{ bg: hoverBg }}
                                        transition="all 0.2s"
                                      >
                                        <Avatar
                                          size="sm"
                                          name={user.name}
                                          src={user.avatar || undefined}
                                          mr={2}
                                        />
                                        <Box>
                                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                            {user.name}
                                          </Text>
                                          <Text fontSize="xs" color={textColor}>
                                            {user.role}
                                          </Text>
                                        </Box>
                                      </Flex>
                                    ))}
                                  </SimpleGrid>
                                </Box>
                              ) : (
                                <Center py={8}>
                                  <VStack spacing={3}>
                                    <Icon as={FiUsers} boxSize={8} color="gray.400" />
                                    <Text color="gray.500" textAlign="center">
                                      No hay miembros asignados al proyecto
                                    </Text>
                                    {(isProjectCreator || isAdmin) && (
                                      <Button
                                        size="sm"
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={onUsersModalOpen}
                                      >
                                        Añadir miembros
                                      </Button>
                                    )}
                                  </VStack>
                                </Center>
                              )}
                            </VStack>
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                  </GridItem>
                  
                  <GridItem>
                    <VStack spacing={6} align="stretch">
                      <Box
                        p={6}
                        bg={useColorModeValue('white', 'gray.700')}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <VStack align="stretch" spacing={4}>
                          <Heading size="md" color={textColor}>Detalles</Heading>
                          <Divider />
                          
                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={FiCalendar} color="blue.500" />
                              <Text fontSize="sm">Fecha de inicio</Text>
                            </HStack>
                            <Text fontSize="sm" color={textColor}>
                              {formatDate(currentProject.start_date)}
                            </Text>
                          </HStack>

                          {currentProject.end_date && (
                            <HStack justify="space-between">
                              <HStack>
                                <Icon as={FiClock} color="blue.500" />
                                <Text fontSize="sm">Fecha de fin</Text>
                              </HStack>
                              <Text fontSize="sm" color={textColor}>
                                {formatDate(currentProject.end_date)}
                              </Text>
                            </HStack>
                          )}

                          <Divider />

                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={FiUser} color="blue.500" />
                              <Text fontSize="sm">Creador</Text>
                            </HStack>
                            <Text fontSize="sm" color={textColor}>
                              {currentProject.creator?.name || 'Usuario'}
                            </Text>
                          </HStack>

                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={FiUsers} color="blue.500" />
                              <Text fontSize="sm">Total tareas</Text>
                            </HStack>
                            <Badge
                              colorScheme="blue"
                              variant="subtle"
                              px={2}
                              py={0.5}
                              borderRadius="full"
                            >
                              {currentProject.tasks?.length || 0}
                            </Badge>
                          </HStack>
                        </VStack>
                      </Box>

                      {/* Nueva sección de estadísticas */}
                      <Box
                        p={6}
                        bg={useColorModeValue('white', 'gray.700')}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <VStack align="stretch" spacing={4}>
                          <Heading size="md" color={textColor}>Estadísticas</Heading>
                          <Divider />
                          
                          <SimpleGrid columns={2} spacing={4}>
                            <Box>
                              <Text fontSize="sm" color="gray.500" mb={1}>Tareas Completadas</Text>
                              <HStack>
                                <CircularProgress
                                  value={(currentProject.tasks?.filter(task => task.status === 'completed').length || 0) / (currentProject.tasks?.length || 1) * 100}
                                  color="green.500"
                                  size="60px"
                                >
                                  <CircularProgressLabel>
                                    {Math.round((currentProject.tasks?.filter(task => task.status === 'completed').length || 0) / (currentProject.tasks?.length || 1) * 100)}%
                                  </CircularProgressLabel>
                                </CircularProgress>
                                <Text fontSize="sm" color={textColor}>
                                  {currentProject.tasks?.filter(task => task.status === 'completed').length || 0} de {currentProject.tasks?.length || 0}
                                </Text>
                              </HStack>
                            </Box>

                            <Box>
                              <Text fontSize="sm" color="gray.500" mb={1}>Tareas en Progreso</Text>
                              <HStack>
                                <CircularProgress
                                  value={(currentProject.tasks?.filter(task => task.status === 'in progress').length || 0) / (currentProject.tasks?.length || 1) * 100}
                                  color="blue.500"
                                  size="60px"
                                >
                                  <CircularProgressLabel>
                                    {Math.round((currentProject.tasks?.filter(task => task.status === 'in progress').length || 0) / (currentProject.tasks?.length || 1) * 100)}%
                                  </CircularProgressLabel>
                                </CircularProgress>
                                <Text fontSize="sm" color={textColor}>
                                  {currentProject.tasks?.filter(task => task.status === 'in progress').length || 0} de {currentProject.tasks?.length || 0}
                                </Text>
                              </HStack>
                            </Box>
                          </SimpleGrid>

                          <Divider />

                          <Box>
                            <Text fontSize="sm" color="gray.500" mb={2}>Estado del Proyecto</Text>
                            <HStack spacing={4}>
                              <Badge
                                colorScheme={getStatusColor(currentProject.status)}
                                variant="subtle"
                                px={3}
                                py={1}
                                borderRadius="full"
                                fontSize="sm"
                              >
                                {currentProject.status === 'completed' ? 'Completado' : 
                                 currentProject.status === 'in progress' ? 'En progreso' : 'Pendiente'}
                              </Badge>
                              <Badge
                                colorScheme={getPriorityColor(currentProject.priority)}
                                variant="subtle"
                                px={3}
                                py={1}
                                borderRadius="full"
                                fontSize="sm"
                              >
                                Prioridad {currentProject.priority === 'high' ? 'Alta' :
                                          currentProject.priority === 'medium' ? 'Media' : 'Baja'}
                              </Badge>
                            </HStack>
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                  </GridItem>
                </Grid>
              </TabPanel>
              
              <TabPanel>
                <KanbanBoard projectId={Number(projectId)} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      {/* Modales */}
      <ProjectUsersModal
        isOpen={isUsersModalOpen}
        onClose={onUsersModalClose}
        projectId={Number(projectId)}
        onUsersUpdated={() => {
          if (projectId) {
            refreshProject();
          }
        }}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={currentProject}
        onProjectUpdated={handleProjectUpdated}
      />

      {/* Modal de Confirmación de Eliminación */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Eliminación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>¿Estás seguro de que deseas eliminar este proyecto?</Text>
              <Text fontSize="sm" color="red.500">
                Esta acción no se puede deshacer. Se eliminarán todas las tareas y datos asociados al proyecto.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteModalClose}>
              Cancelar
            </Button>
            <Button 
              colorScheme="red" 
              onClick={() => {
                handleDeleteProject();
                onDeleteModalClose();
              }}
            >
              Eliminar Proyecto
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProjectDetails;