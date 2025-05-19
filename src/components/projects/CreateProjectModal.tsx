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
import { FiFolder, FiCalendar, FiFlag, FiAlignLeft } from 'react-icons/fi';
import { createProject } from '../../services/projectService';

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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const inputBorder = useColorModeValue('gray.200', 'gray.600');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }
    if (endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      await createProject({
        name,
        description,
        priority: priority as 'low' | 'medium' | 'high',
        start_date: startDate,
        end_date: endDate || undefined,
        status: 'in progress'
      });

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
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el proyecto',
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
              <Icon as={FiFolder} boxSize={5} color="blue.500" />
              <Box>Crear Nuevo Proyecto</Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody py={6}>
            <VStack spacing={5}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel fontWeight="medium" fontSize="sm">
                  <Flex align="center" gap={2}>
                    <Icon as={FiFolder} boxSize={4} />
                    Nombre del Proyecto
                  </Flex>
                </FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre del proyecto"
                  bg={inputBg}
                  borderColor={inputBorder}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.description}>
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
                <FormErrorMessage>{errors.description}</FormErrorMessage>
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
                    Fecha de Inicio
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
                    Fecha de Fin (Opcional)
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