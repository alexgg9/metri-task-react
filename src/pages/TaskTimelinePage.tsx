import React from 'react';
import { Box } from '@chakra-ui/react';
import TaskTimeline from '../components/tasks/TaskTimeline';

const TaskTimelinePage: React.FC = () => {
  return (
    <Box>
      <TaskTimeline />
    </Box>
  );
};

export default TaskTimelinePage; 