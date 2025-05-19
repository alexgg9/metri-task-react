import React, { useState } from 'react';
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
  Flex
} from '@chakra-ui/react';
import { FiCalendar, FiFlag, FiType, FiAlignLeft } from 'react-icons/fi';
import { createTask } from '../../services/taskService';

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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const inputBorder = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTask({
        name,
        description,
        priority: priority as 'low' | 'medium' | 'high',
        dueDate,
        status: 'pending',
        project_id: projectId
      });

      toast({
        title: 'Tarea creada',
        description: 'La tarea se ha creado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onTaskCreated();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la tarea',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
              colorScheme="blue"
              type="submit"
              isLoading={loading}
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