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
  Divider
} from '@chakra-ui/react';
import { FiCalendar, FiUser, FiClock, FiTag } from 'react-icons/fi';
import { Task } from '../../types/task';

interface KanbanCardProps {
  task: Task;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const secondaryTextColor = useColorModeValue('gray.500', 'gray.400');

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'md',
        bg: hoverBg,
      }}
      transition="all 0.2s"
      cursor="pointer"
      width="100%"
    >
      <VStack align="stretch" spacing={3}>
        <Flex justify="space-between" align="center">
          <Text
            fontSize="md"
            fontWeight="semibold"
            color={textColor}
            noOfLines={2}
          >
            {task.name}
          </Text>
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
            <Text fontSize="sm">
              {task.dueDate ? formatDate(task.dueDate) : 'Sin fecha límite'}
            </Text>
          </HStack>

          {task.dueDate && (
            <HStack spacing={2} color={secondaryTextColor}>
              <Icon as={FiClock} boxSize={4} />
              <Text fontSize="sm">
                {getTimeAgo(task.dueDate)}
              </Text>
            </HStack>
          )}

          {task.assignee && (
            <HStack spacing={2} color={secondaryTextColor}>
              <Icon as={FiUser} boxSize={4} />
              <Text fontSize="sm">
                Asignado a: {task.assignee.name}
              </Text>
            </HStack>
          )}

          {task.tags && task.tags.length > 0 && (
            <HStack spacing={2} color={secondaryTextColor}>
              <Icon as={FiTag} boxSize={4} />
              <HStack spacing={1} wrap="wrap">
                {task.tags.map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    colorScheme="blue"
                    variant="subtle"
                    fontSize="xs"
                    px={1.5}
                    py={0.5}
                    borderRadius="full"
                  >
                    {tag}
                  </Badge>
                ))}
              </HStack>
            </HStack>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default KanbanCard;