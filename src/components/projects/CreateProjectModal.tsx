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
  Flex,
  FormErrorMessage
} from '@chakra-ui/react';
import { FiCalendar, FiFlag, FiType, FiAlignLeft } from 'react-icons/fi';
import { createProject } from '../../services/projectService';
import { useAuth } from '../../contexts/AuthContext';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated
}) => {
  // 1. Hooks de estado
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 2. Hooks de Chakra UI
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const inputBorder = useColorModeValue('gray.200', 'gray.600');

  // 3. Hooks de contexto
  const { user } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }
    
    if (endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'La fecha de fin debe ser posterior o igual a la fecha de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      const projectData = {
        name,
        description,
        priority: priority as 'low' | 'medium' | 'high',
        start_date: startDate,
        end_date: endDate,
        status: 'in progress' as const,
        progress: 0,
        user_id: user.id
      };

      console.log('Datos del proyecto antes de enviar:', projectData);

      await createProject(projectData);

      toast({
        title: 'Proyecto creado',
        description: 'El proyecto se ha creado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onProjectCreated();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Error al crear el proyecto:', error);
      const errorMessage = error.response?.data?.message || 'No se pudo crear el proyecto';
      toast({
        title: 'Error',
        description: errorMessage,
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
    setStartDate('');
    setEndDate('');
    setErrors({});
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
              <Box>Crear Nuevo Proyecto</Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody py={6}>
            <VStack spacing={5}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel fontWeight="medium" fontSize="sm">
                  <Flex align="center" gap={2}>
                    <Icon as={FiType} boxSize={4} />
                    Título
                  </Flex>
                </FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Título del proyecto"
                  bg={inputBg}
                  borderColor={inputBorder}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
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
                  placeholder="Descripción del proyecto"
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

              <FormControl isRequired isInvalid={!!errors.startDate}>
                <FormLabel fontWeight="medium" fontSize="sm">
                  <Flex align="center" gap={2}>
                    <Icon as={FiCalendar} boxSize={4} />
                    Fecha de inicio
                  </Flex>
                </FormLabel>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  bg={inputBg}
                  borderColor={inputBorder}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
                <FormErrorMessage>{errors.startDate}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.endDate}>
                <FormLabel fontWeight="medium" fontSize="sm">
                  <Flex align="center" gap={2}>
                    <Icon as={FiCalendar} boxSize={4} />
                    Fecha de fin
                  </Flex>
                </FormLabel>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  bg={inputBg}
                  borderColor={inputBorder}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
                <FormErrorMessage>{errors.endDate}</FormErrorMessage>
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
              Crear Proyecto
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateProjectModal; 