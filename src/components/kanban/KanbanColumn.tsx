import React from 'react';
import {
  Box,
  Text,
  VStack,
  useColorModeValue,
  Flex,
  Circle
} from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../../types/task';
import SortableTask from './SortableTask';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  columnBg?: string;
  headerBg?: string;
  borderColor?: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  columnBg = 'gray.50',
  headerBg = 'gray.100',
  borderColor
}) => {
  const { setNodeRef } = useDroppable({ id });
  const defaultBorderColor = useColorModeValue('gray.200', 'gray.600');

  const getColumnColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'in_progress':
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
    >
      <Box
        bg={headerBg}
        p={4}
        borderBottomWidth="1px"
        borderBottomColor={borderColor || defaultBorderColor}
      >
        <Flex align="center" gap={2}>
          <Circle size={2} bg={`${getColumnColor(id)}.500`} />
          <Text fontWeight="medium" fontSize="sm" color="gray.600">
            {title}
          </Text>
          <Circle
            size={5}
            bg={useColorModeValue('white', 'gray.700')}
            color="gray.500"
            fontSize="xs"
            fontWeight="bold"
          >
            {tasks.length}
          </Circle>
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