import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  SimpleGrid,
  useDisclosure,
  useColorModeValue,
  HStack,
  Icon,
  Spinner,
  Center,
  useToast,
  Card,
  CardBody,
  Heading,
  VStack,
  Badge,
  Flex,
} from '@chakra-ui/react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { FiPlus, FiList, FiClock, FiCheckCircle } from 'react-icons/fi';
import { Task } from '../../types/task';
import { getTasksByProjectId, updateTask } from '../../services/taskService';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import CreateTaskModal from './CreateTaskModal';

interface KanbanBoardProps {
  projectId: number;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');


  const pendingColumnBg = useColorModeValue('gray.50', 'gray.800');
  const pendingHeaderBg = useColorModeValue('gray.100', 'gray.700');
  const inProgressColumnBg = useColorModeValue('blue.50', 'blue.900');
  const inProgressHeaderBg = useColorModeValue('blue.100', 'blue.800');
  const completedColumnBg = useColorModeValue('green.50', 'green.900');
  const completedHeaderBg = useColorModeValue('green.100', 'green.800');

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasksByProjectId(projectId);
      if (!Array.isArray(data)) {
        setTasks([]);
        return;
      }
      const validTasks = data.filter(task => task && typeof task.id === 'number' && typeof task.title === 'string' && typeof task.status === 'string');
      setTasks(validTasks);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudieron cargar las tareas.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [projectId, toast]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find((t) => t.id.toString() === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  }, [tasks]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedTask = tasks.find((t) => t.id.toString() === active.id);
    if (!draggedTask) return;

    const statusMap: { [key: string]: Task['status'] } = {
      'pending': 'pending',
      'in_progress': 'in progress',
      'completed': 'completed'
    };

    const columnId = String(over.id);
    const newStatus = statusMap[columnId];

    if (!newStatus) {
      toast({
        title: 'Estado inválido',
        description: `El estado "${columnId}" no es reconocido.`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (draggedTask.status === newStatus) {
      setActiveTask(null);
      return;
    }

    const updatedTask: Task = {
      ...draggedTask,
      status: newStatus,
      user_id: draggedTask.user_id || null,
      project_id: draggedTask.project_id
    };

    const updatedTasks = tasks.map((t) => t.id === draggedTask.id ? updatedTask : t);
    setTasks(updatedTasks);

    try {
      await updateTask(draggedTask.id, updatedTask);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo actualizar el estado de la tarea.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setTasks(tasks);
    } finally {
      setActiveTask(null);
    }
  }, [tasks, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'in progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl" overflow="hidden">
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Heading size="md" color={textColor}>Tablero Kanban</Heading>
              <Badge colorScheme="blue" variant="subtle" px={2} py={1} borderRadius="full">
                {tasks.length} tareas
              </Badge>
            </HStack>
            <Button
              leftIcon={<Icon as={FiPlus} />}
              colorScheme="blue"
              size="sm"
              onClick={onOpen}
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              Nueva Tarea
            </Button>
          </Flex>

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <KanbanColumn
                id="pending"
                title="Pendientes"
                icon={FiList}
                tasks={pendingTasks}
                columnBg={pendingColumnBg}
                headerBg={pendingHeaderBg}
                borderColor={borderColor}
                colorScheme="gray"
              />
              <KanbanColumn
                id="in_progress"
                title="En Progreso"
                icon={FiClock}
                tasks={inProgressTasks}
                columnBg={inProgressColumnBg}
                headerBg={inProgressHeaderBg}
                borderColor={borderColor}
                colorScheme="blue"
              />
              <KanbanColumn
                id="completed"
                title="Completadas"
                icon={FiCheckCircle}
                tasks={completedTasks}
                columnBg={completedColumnBg}
                headerBg={completedHeaderBg}
                borderColor={borderColor}
                colorScheme="green"
              />
            </SimpleGrid>

            <DragOverlay>
              {activeTask && (
                <Box transform="rotate(3deg)" transition="transform 0.2s" boxShadow="xl">
                  <KanbanCard task={activeTask} />
                </Box>
              )}
            </DragOverlay>
          </DndContext>
        </VStack>
      </CardBody>

      <CreateTaskModal
        isOpen={isOpen}
        onClose={onClose}
        projectId={projectId}
        onTaskCreated={fetchTasks}
      />
    </Card>
  );
};

export default KanbanBoard;
