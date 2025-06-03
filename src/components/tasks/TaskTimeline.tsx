import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Badge,
  Flex,
  Icon,
  useColorModeValue,
  Avatar,
  Tooltip,
  Divider,
  Spinner,
  Center,
  Heading,
  HStack
} from '@chakra-ui/react';
import { FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { Task } from '../../types/task';
import { getUserTasks } from '../../services/taskService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';

const TaskTimeline: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const timelineColor = useColorModeValue('blue.200', 'blue.700');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log('Usuario actual en TaskTimeline:', user);
        const tasksData = await getUserTasks();
        console.log('Tareas recibidas en TaskTimeline:', tasksData);

        // Ordenar tareas por fecha de vencimiento
        const sortedTasks = tasksData.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });

        setTasks(sortedTasks);
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in progress':
        return 'blue';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Sin fecha';
    return format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: es });
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box p={4}>
      <Heading size="lg" mb={6} color={textColor}>
        Tareas Asignadas
      </Heading>
      <VStack spacing={4} align="stretch">
        {tasks.map((task, index) => (
          <Box key={task.id} position="relative">
            {/* Línea de tiempo */}
            {index < tasks.length - 1 && (
              <Box
                position="absolute"
                left="24px"
                top="40px"
                bottom="-20px"
                width="2px"
                bg={timelineColor}
                zIndex={0}
              />
            )}
            
            <Flex
              bg={bgColor}
              p={4}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
              position="relative"
              zIndex={1}
            >
              {/* Punto en la línea de tiempo */}
              <Box
                position="absolute"
                left="-12px"
                top="50%"
                transform="translateY(-50%)"
                width="24px"
                height="24px"
                borderRadius="full"
                bg={timelineColor}
                border="4px solid"
                borderColor={bgColor}
                zIndex={2}
              />

              <VStack align="start" spacing={2} flex={1}>
                <Flex justify="space-between" width="100%" align="center">
                  <Text fontWeight="bold" color={textColor}>
                    {task.title}
                  </Text>
                  <HStack spacing={2}>
                    <Badge colorScheme={getStatusColor(task.status)}>
                      {task.status === 'completed' ? 'Completada' :
                       task.status === 'in progress' ? 'En progreso' : 'Pendiente'}
                    </Badge>
                    <Badge colorScheme={getPriorityColor(task.priority)}>
                      {task.priority === 'high' ? 'Alta' :
                       task.priority === 'medium' ? 'Media' : 'Baja'}
                    </Badge>
                  </HStack>
                </Flex>

                <Text color={textColor} fontSize="sm">
                  {task.description}
                </Text>

                <Divider />

                <Flex width="100%" justify="space-between" align="center">
                  <HStack spacing={4}>
                    <Tooltip label="Fecha de vencimiento">
                      <Flex align="center">
                        <Icon as={FiCalendar} color="blue.500" mr={1} />
                        <Text fontSize="sm" color={textColor}>
                          {formatDate(task.due_date)}
                        </Text>
                      </Flex>
                    </Tooltip>

                    {task.assigned_to && (
                      <Tooltip label="Asignado a">
                        <Flex align="center">
                          <Avatar
                            size="xs"
                            name={task.assigned_to.name}
                            src={task.assigned_to.avatar}
                            mr={2}
                          />
                          <Text fontSize="sm" color={textColor}>
                            {task.assigned_to.name}
                          </Text>
                        </Flex>
                      </Tooltip>
                    )}
                  </HStack>

                  {task.completed_at && (
                    <Tooltip label="Completada">
                      <Flex align="center">
                        <Icon as={FiCheckCircle} color="green.500" mr={1} />
                        <Text fontSize="sm" color={textColor}>
                          {formatDate(task.completed_at)}
                        </Text>
                      </Flex>
                    </Tooltip>
                  )}
                </Flex>
              </VStack>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default TaskTimeline; 