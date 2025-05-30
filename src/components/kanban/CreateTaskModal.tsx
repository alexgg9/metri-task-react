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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  VStack,
  useColorModeValue,
  Box,
  Icon,
  Flex,
  Avatar,
  AvatarGroup,
  HStack,
  Text
} from '@chakra-ui/react';
import { FiCalendar, FiFlag, FiType, FiAlignLeft, FiUser } from 'react-icons/fi';
import { createTask } from '../../services/taskService';
import { getProjectUsers } from '../../services/userService';
import { User } from '../../types/user';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  onTaskCreated: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onTaskCreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const inputBorder = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Cargando usuarios para el proyecto:', projectId);
        const projectUsers = await getProjectUsers(projectId);
        console.log('Usuarios cargados:', projectUsers);
        setUsers(projectUsers);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'No se pudieron cargar los usuarios del proyecto',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setUsers([]);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, projectId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!title.trim()) {
        toast({
          title: 'Error',
          description: 'El título es requerido',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority: priority as 'low' | 'medium' | 'high',
        due_date: dueDate || null,
        status: 'pending' as 'pending' | 'in progress' | 'completed',
        project_id: projectId,
        user_id: assigneeId
      };

      console.log('Enviando datos de tarea:', taskData);
      const createdTask = await createTask(taskData);
      console.log('Tarea creada:', createdTask);

      toast({
        title: 'Tarea creada',
        description: 'La tarea se ha creado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });


      onClose();
      resetForm();
      

      onTaskCreated();
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo crear la tarea',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setAssigneeId(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent
        bg={bgColor}
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="xl"
      >
        <form onSubmit={handleSubmit}>
          <ModalHeader
            borderBottomWidth="1px"
            borderColor={borderColor}
            pb={4}
          >
            <Flex align="center" gap={2}>
              <Icon as={FiType} boxSize={5} color="blue.500" />
              <Box>Crear Nueva Tarea</Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody py={6}>
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel fontWeight="medium" fontSize="sm">
                  <Flex align="center" gap={2}>
                    <Icon as={FiType} boxSize={4} />
                    Título
                  </Flex>
                </FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título de la tarea"
                  bg={inputBg}
                  borderColor={inputBorder}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="medium" fontSize="sm">
                  <Flex align="center" gap={2}>
                    <Icon as={FiAlignLeft} boxSize={4} />
                    Descripción
                  </Flex>
                </FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción de la tarea"
                  rows={3}
                  bg={inputBg}
                  borderColor={inputBorder}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="medium" fontSize="sm">
                  <Flex align="center" gap={2}>
                    <Icon as={FiFlag} boxSize={4} />
                    Prioridad
                  </Flex>
                </FormLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  bg={inputBg}
                  borderColor={inputBorder}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="medium" fontSize="sm">
                  <Flex align="center" gap={2}>
                    <Icon as={FiCalendar} boxSize={4} />
                    Fecha límite
                  </Flex>
                </FormLabel>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  bg={inputBg}
                  borderColor={inputBorder}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="medium" fontSize="sm">
                  <Flex align="center" gap={2}>
                    <Icon as={FiUser} boxSize={4} />
                    Asignar a
                  </Flex>
                </FormLabel>
                <Select
                  value={assigneeId || ''}
                  onChange={(e) => setAssigneeId(e.target.value ? Number(e.target.value) : null)}
                  placeholder="Seleccionar usuario"
                  bg={inputBg}
                  borderColor={inputBorder}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
                {users.length > 0 && (
                  <HStack mt={2} spacing={2}>
                    <Text fontSize="sm" color="gray.500">Miembros del proyecto:</Text>
                    <AvatarGroup size="sm" max={3}>
                      {users.map((user) => (
                        <Avatar
                          key={user.id}
                          name={user.name}
                          src={user.avatar}
                          size="sm"
                          cursor="pointer"
                          onClick={() => setAssigneeId(user.id)}
                          opacity={assigneeId === user.id ? 1 : 0.6}
                          _hover={{ opacity: 1 }}
                          transition="opacity 0.2s"
                        />
                      ))}
                    </AvatarGroup>
                  </HStack>
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter
            borderTopWidth="1px"
            borderColor={borderColor}
            pt={4}
          >
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              loadingText="Creando..."
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              Crear Tarea
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateTaskModal;
