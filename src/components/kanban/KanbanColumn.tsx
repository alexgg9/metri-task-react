import React from 'react';
import {
  Box,
  Text,
  VStack,
  useColorModeValue,
  Flex,
  Icon,
  Badge,
  HStack
} from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../../types/task';
import SortableTask from './SortableTask';
import { IconType } from 'react-icons';

interface KanbanColumnProps {
  id: string;
  title: string;
  icon: IconType;
  tasks: Task[];
  columnBg?: string;
  headerBg?: string;
  borderColor?: string;
  colorScheme?: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  icon,
  tasks,
  columnBg = 'gray.50',
  headerBg = 'gray.100',
  borderColor,
  colorScheme = 'gray'
}) => {
  const { setNodeRef } = useDroppable({ id });
  const defaultBorderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');

  const getColumnColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'in progress':
        return 'blue';
      case 'completed':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      bg={columnBg}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor || defaultBorderColor}
      overflow="hidden"
      boxShadow="sm"
      transition="all 0.2s"
      _hover={{ boxShadow: 'md' }}
    >
      <Box
        bg={headerBg}
        p={4}
        borderBottomWidth="1px"
        borderBottomColor={borderColor || defaultBorderColor}
      >
        <Flex align="center" justify="space-between">
          <HStack spacing={3}>
            <Icon as={icon} color={`${colorScheme}.500`} boxSize={5} />
            <Text fontWeight="medium" fontSize="sm" color={textColor}>
              {title}
            </Text>
          </HStack>
          <Badge
            colorScheme={colorScheme}
            variant="subtle"
            px={2}
            py={0.5}
            borderRadius="full"
          >
            {tasks.length}
          </Badge>
        </Flex>
      </Box>

      <Box p={4}>
        <SortableContext
          items={tasks.map(task => task.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <VStack
            ref={setNodeRef}
            spacing={4}
            align="stretch"
            minH="200px"
            maxH="calc(100vh - 300px)"
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: useColorModeValue('gray.200', 'gray.600'),
                borderRadius: '24px',
              },
            }}
          >
            {tasks.map(task => (
              <SortableTask key={task.id} task={task} />
            ))}
          </VStack>
        </SortableContext>
      </Box>
    </Box>
  );
};

export default KanbanColumn;