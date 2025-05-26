import React from 'react';
import {
  Card,
  CardBody,
  Heading,
  Divider,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Progress,
  Text,
  VStack,
  Box
} from '@chakra-ui/react';
import { 
  FiCheckCircle, 
  FiActivity, 
  FiClock, 
  FiList, 
  FiUsers,
  FiBarChart2 
} from 'react-icons/fi';

interface UserStatsCardProps {
  stats: {
    projectsCompleted: number;
    tasksCompleted: number;
    projectsInProgress: number;
    totalProjects?: number;
    totalTasks?: number;
    pendingTasks?: number;
  };
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ stats }) => {
  const statCardBg = useColorModeValue('white', 'gray.700');
  const progressBg = useColorModeValue('gray.100', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const projectCompletionRate = stats.totalProjects 
    ? Math.round((stats.projectsCompleted / stats.totalProjects) * 100) 
    : 0;

  const taskCompletionRate = stats.totalTasks 
    ? Math.round((stats.tasksCompleted / stats.totalTasks) * 100) 
    : 0;

  return (
    <Card 
      variant="outline" 
      bg={statCardBg} 
      shadow="md"
      borderRadius="xl"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
    >
      <CardBody>
        <Heading size="sm" mb={4}>Estadísticas</Heading>
        
        <SimpleGrid columns={2} spacing={4} mb={6}>
          <Stat>
            <HStack>
              <Icon as={FiBarChart2} color="blue.500" />
              <StatLabel>Proyectos</StatLabel>
            </HStack>
            <StatNumber>{stats.totalProjects || 0}</StatNumber>
            <Progress 
              value={projectCompletionRate} 
              size="sm" 
              colorScheme="blue" 
              bg={progressBg}
              borderRadius="full"
              mt={2}
            />
            <Text fontSize="xs" color={textColor} mt={1}>
              {projectCompletionRate}% completados
            </Text>
          </Stat>

          <Stat>
            <HStack>
              <Icon as={FiList} color="green.500" />
              <StatLabel>Tareas</StatLabel>
            </HStack>
            <StatNumber>{stats.totalTasks || 0}</StatNumber>
            <Progress 
              value={taskCompletionRate} 
              size="sm" 
              colorScheme="green" 
              bg={progressBg}
              borderRadius="full"
              mt={2}
            />
            <Text fontSize="xs" color={textColor} mt={1}>
              {taskCompletionRate}% completadas
            </Text>
          </Stat>
        </SimpleGrid>

        <Divider my={4} />
        
        <SimpleGrid columns={2} spacing={4}>
          <Stat>
            <HStack>
              <Icon as={FiCheckCircle} color="green.500" />
              <StatLabel>Completados</StatLabel>
            </HStack>
            <VStack align="start" spacing={1}>
              <StatNumber>{stats.projectsCompleted}</StatNumber>
              <Text fontSize="xs" color={textColor}>Proyectos</Text>
            </VStack>
          </Stat>

          <Stat>
            <HStack>
              <Icon as={FiClock} color="orange.500" />
              <StatLabel>En Progreso</StatLabel>
            </HStack>
            <VStack align="start" spacing={1}>
              <StatNumber>{stats.projectsInProgress}</StatNumber>
              <Text fontSize="xs" color={textColor}>Proyectos</Text>
            </VStack>
          </Stat>

          <Stat>
            <HStack>
              <Icon as={FiActivity} color="blue.500" />
              <StatLabel>Completadas</StatLabel>
            </HStack>
            <VStack align="start" spacing={1}>
              <StatNumber>{stats.tasksCompleted}</StatNumber>
              <Text fontSize="xs" color={textColor}>Tareas</Text>
            </VStack>
          </Stat>

          <Stat>
            <HStack>
              <Icon as={FiUsers} color="purple.500" />
              <StatLabel>Pendientes</StatLabel>
            </HStack>
            <VStack align="start" spacing={1}>
              <StatNumber>{stats.pendingTasks || 0}</StatNumber>
              <Text fontSize="xs" color={textColor}>Tareas</Text>
            </VStack>
          </Stat>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

export default UserStatsCard;