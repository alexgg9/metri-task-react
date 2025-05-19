import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  SimpleGrid,
  useDisclosure,
  useColorModeValue,
  Text,
  HStack,
  Icon
} from '@chakra-ui/react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { FiPlus } from 'react-icons/fi';
import { Task } from '../../types/task';
import { getTasksByProjectId, updateTask } from '../../services/taskService';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import SortableTask from './SortableTask';
import CreateTaskModal from './CreateTaskModal';

interface KanbanBoardProps {
  projectId: number;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  // Hooks de estado
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Hooks de Chakra UI
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Sensores para drag and drop
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  // Funciones
  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasksByProjectId(projectId);
      setTasks(data);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id.toString() === active.id);
    if (task) {
      setActiveTask(task);
    }
  }, [tasks]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTask = tasks.find(t => t.id.toString() === active.id);
    if (!activeTask) return;

    const newStatus = over.id as 'pending' | 'in_progress' | 'completed';
    
    if (activeTask.status !== newStatus) {
      try {
        await updateTask(activeTask.id, { ...activeTask, status: newStatus });
        setTasks(tasks.map(task => 
          task.id === activeTask.id ? { ...task, status: newStatus } : task
        ));
      } catch (error) {
        console.error('Error al actualizar la tarea:', error);
      }
    }
    
    setActiveTask(null);
  }, [tasks]);

  // Efectos
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filtrado de tareas
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  if (loading) {
    return <Box>Cargando...</Box>;
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.700', 'white')}>
          Tablero Kanban
        </Text>
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
      </HStack>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <KanbanColumn
            id="pending"
            title="Pendientes"
            tasks={pendingTasks}
            columnBg="gray.50"
            headerBg="gray.100"
            borderColor={borderColor}
          />
          <KanbanColumn
            id="in_progress"
            title="En Progreso"
            tasks={inProgressTasks}
            columnBg="blue.50"
            headerBg="blue.100"
            borderColor={borderColor}
          />
          <KanbanColumn
            id="completed"
            title="Completadas"
            tasks={completedTasks}
            columnBg="green.50"
            headerBg="green.100"
            borderColor={borderColor}
          />
        </SimpleGrid>

        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        isOpen={isOpen}
        onClose={onClose}
        projectId={projectId}
        onTaskCreated={fetchTasks}
      />
    </Box>
  );
};

export default KanbanBoard;