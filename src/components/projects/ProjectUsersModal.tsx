import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Avatar,
  useToast,
  useColorModeValue,
  Box,
  Icon,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Center
} from '@chakra-ui/react';
import { FiUser, FiUserPlus, FiSearch, FiX } from 'react-icons/fi';
import { User } from '../../types/user';
import { getProjectUsers, addUserToProject, removeUserFromProject, getAllUsers } from '../../services/projectService';

interface ProjectUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  onUsersUpdated: () => void;
}

const ProjectUsersModal: React.FC<ProjectUsersModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onUsersUpdated
}) => {
  const [projectUsers, setProjectUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const inputBorder = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchUsers = async () => {
      if (isOpen) {
        setLoading(true);
        try {
          const [projectUsersData, allUsersData] = await Promise.all([
            getProjectUsers(projectId),
            getAllUsers()
          ]);
          setProjectUsers(projectUsersData);
          setAllUsers(allUsersData);
        } catch (error) {
          console.error('Error al cargar usuarios:', error);
          toast({
            title: 'Error',
            description: 'No se pudieron cargar los usuarios',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [isOpen, projectId, toast]);

  const handleAddUser = async (userId: number) => {
    try {
      await addUserToProject(projectId, userId);
      const updatedProjectUsers = await getProjectUsers(projectId);
      setProjectUsers(updatedProjectUsers);
      onUsersUpdated();
      toast({
        title: 'Usuario añadido',
        description: 'El usuario ha sido añadido al proyecto correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al añadir usuario:', error);
      toast({
        title: 'Error',
        description: 'No se pudo añadir el usuario al proyecto',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRemoveUser = async (userId: number) => {
    try {
      await removeUserFromProject(projectId, userId);
      const updatedProjectUsers = await getProjectUsers(projectId);
      setProjectUsers(updatedProjectUsers);
      onUsersUpdated();
      toast({
        title: 'Usuario eliminado',
        description: 'El usuario ha sido eliminado del proyecto correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el usuario del proyecto',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const isNotInProject = !projectUsers.some(projectUser => projectUser.id === user.id);
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return isNotInProject && matchesSearch;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent
        bg={bgColor}
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="xl"
      >
        <ModalHeader
          borderBottomWidth="1px"
          borderColor={borderColor}
          pb={4}
        >
          <Flex align="center" gap={2}>
            <Icon as={FiUser} boxSize={5} color="blue.500" />
            <Box>Gestionar Usuarios del Proyecto</Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* Usuarios actuales del proyecto */}
            <Box>
              <Text fontWeight="medium" mb={3}>Usuarios del Proyecto</Text>
              {loading ? (
                <Center py={4}>
                  <Spinner />
                </Center>
              ) : projectUsers.length > 0 ? (
                <VStack align="stretch" spacing={3}>
                  {projectUsers.map(user => (
                    <HStack
                      key={user.id}
                      p={3}
                      bg={inputBg}
                      borderRadius="md"
                      justify="space-between"
                    >
                      <HStack spacing={3}>
                        <Avatar size="sm" name={user.name} src={user.avatar} />
                        <Box>
                          <Text fontWeight="medium">{user.name}</Text>
                          <Text fontSize="sm" color="gray.500">{user.email}</Text>
                        </Box>
                      </HStack>
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        leftIcon={<Icon as={FiX} />}
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        Eliminar
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500">No hay usuarios en el proyecto</Text>
              )}
            </Box>

            {/* Añadir nuevos usuarios */}
            <Box>
              <Text fontWeight="medium" mb={3}>Añadir Usuarios</Text>
              <InputGroup mb={4}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg={inputBg}
                  borderColor={inputBorder}
                />
              </InputGroup>

              {filteredUsers.length > 0 ? (
                <VStack align="stretch" spacing={3}>
                  {filteredUsers.map(user => (
                    <HStack
                      key={user.id}
                      p={3}
                      bg={inputBg}
                      borderRadius="md"
                      justify="space-between"
                    >
                      <HStack spacing={3}>
                        <Avatar size="sm" name={user.name} src={user.avatar} />
                        <Box>
                          <Text fontWeight="medium">{user.name}</Text>
                          <Text fontSize="sm" color="gray.500">{user.email}</Text>
                        </Box>
                      </HStack>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<Icon as={FiUserPlus} />}
                        onClick={() => handleAddUser(user.id)}
                      >
                        Añadir
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500">
                  {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios disponibles para añadir'}
                </Text>
              )}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter
          borderTopWidth="1px"
          borderColor={borderColor}
          pt={4}
        >
          <Button
            colorScheme="blue"
            onClick={onClose}
            _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProjectUsersModal; 