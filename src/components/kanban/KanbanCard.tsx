import React from 'react';
import {
  Box,
  Text,
  Badge,
  HStack,
  VStack,
  Flex,
  Icon,
  useColorModeValue,
  Tooltip,
  Divider,
  Avatar,
  AvatarBadge
} from '@chakra-ui/react';
import { FiCalendar, FiUser, FiClock, FiCheckCircle } from 'react-icons/fi';
import { Task } from '../../types/task';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface KanbanCardProps {
  task: Task;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');
  const secondaryTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardShadow = useColorModeValue('sm', 'md');

  console.log('Datos de la tarea:', {
    id: task.id,
    title: task.title,
    assigned_to: task.assigned_to,
    user_id: task.user_id
  });

  const getPriorityColor = (priority: Task['priority']) => {
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

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'in progress':
        return 'blue';
      case 'completed':
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

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    return formatDate(dateString);
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow={cardShadow}
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
        bg: hoverBg,
      }}
      transition="all 0.2s"
      cursor="pointer"
      width="100%"
      position="relative"
    >
      {task.status === 'completed' && (
        <Box
          position="absolute"
          top={2}
          right={2}
          color="green.500"
          zIndex={1}
        >
          <Icon as={FiCheckCircle} boxSize={5} />
        </Box>
      )}

      <VStack align="stretch" spacing={3}>
        <Flex justify="space-between" align="start" gap={2}>
          <Text
            fontSize="md"
            fontWeight="semibold"
            color={textColor}
            noOfLines={2}
            flex={1}
          >
            {task.title} 
          </Text>
          <HStack spacing={2}>
            <Badge
              colorScheme={getStatusColor(task.status)}
              variant="subtle"
              px={2}
              py={0.5}
              borderRadius="full"
              fontSize="xs"
            >
              {task.status === 'completed' ? 'Completada' :
               task.status === 'in progress' ? 'En progreso' : 'Pendiente'}
            </Badge>
            <Badge
              colorScheme={getPriorityColor(task.priority)}
              variant="subtle"
              px={2}
              py={0.5}
              borderRadius="full"
              fontSize="xs"
            >
              {task.priority === 'high' ? 'Alta' :
               task.priority === 'medium' ? 'Media' : 'Baja'}
            </Badge>
          </HStack>
        </Flex>

        {task.description && (
          <Text
            fontSize="sm"
            color={secondaryTextColor}
            noOfLines={2}
          >
            {task.description}
          </Text>
        )}

        <Divider />

        <VStack align="stretch" spacing={2}>
          <HStack spacing={2} color={secondaryTextColor}>
            <Icon as={FiCalendar} boxSize={4} />
            <Text fontSize="sm" color={isOverdue ? 'red.500' : secondaryTextColor}>
              {task.due_date ? formatDate(task.due_date) : 'Sin fecha límite'}
            </Text>
          </HStack>

          {task.due_date && (
            <HStack spacing={2} color={isOverdue ? 'red.500' : secondaryTextColor}>
              <Icon as={FiClock} boxSize={4} />
              <Text fontSize="sm">
                {getTimeAgo(task.due_date)}
              </Text>
            </HStack>
          )}

          {task.assigned_to && (
            <HStack spacing={2} color={secondaryTextColor}>
              <Avatar 
                size="xs" 
                name={task.assigned_to.name}
                src={task.assigned_to.avatar}
              />
              <Text fontSize="sm">
                {task.assigned_to.name}
              </Text>
            </HStack>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default KanbanCard;