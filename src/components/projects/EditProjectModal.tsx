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
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text
} from '@chakra-ui/react';
import { FiCalendar, FiFlag, FiType, FiAlignLeft, FiPercent } from 'react-icons/fi';
import { updateProject, getProjectById } from '../../services/projectService';
import { Project } from '../../types/project';
import { useProject } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onProjectUpdated: (project: Project) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onProjectUpdated
}) => {
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const { refreshProject } = useProject();
  const { user } = useAuth();

  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'pending',
    priority: 'medium',
    progress: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
        start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : '',
        end_date: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : '',
        status: project.status || 'pending',
        priority: project.priority || 'medium',
        progress: project.progress || 0
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      console.log('Iniciando actualización del proyecto:', {
        projectId: project?.id,
        formData
      });

      if (!project?.id) {
        throw new Error('ID del proyecto no encontrado');
      }

      // Actualizar el proyecto
      const updatedProject = await updateProject(project.id, formData);
      console.log('Proyecto actualizado exitosamente:', updatedProject);

      // Notificar al componente padre
      if (onProjectUpdated) {
        onProjectUpdated(updatedProject);
      }

      // Forzar un refresh del proyecto
      await refreshProject();
      console.log('Proyecto refrescado después de la actualización');

      // Cerrar el modal después de un breve delay
      setTimeout(() => {
        onClose();
      }, 500);

    } catch (error) {
      console.error('Error al actualizar el proyecto:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar el proyecto');
    } finally {
      setIsSubmitting(false);
    }
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
              <Box>Editar Proyecto</Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody py={6}>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Nombre del Proyecto</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre del proyecto"
                />
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción del proyecto"
                  rows={4}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Estado</FormLabel>
                <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="pending">Pendiente</option>
                  <option value="active">Activo</option>
                  <option value="in progress">En progreso</option>
                  <option value="completed">Completado</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Prioridad</FormLabel>
                <Select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </Select>
              </FormControl>

              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Progreso</FormLabel>
                <NumberInput
                  value={formData.progress}
                  onChange={(_, value) => setFormData({ ...formData, progress: value })}
                  min={0}
                  max={100}
                  clampValueOnBlur
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Calculado automáticamente según las tareas completadas
                </Text>
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Fecha de inicio</FormLabel>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Fecha de fin</FormLabel>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  min={formData.start_date}
                />
                <FormErrorMessage>{error}</FormErrorMessage>
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
            >
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Guardando..."
            >
              Guardar Cambios
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditProjectModal; 