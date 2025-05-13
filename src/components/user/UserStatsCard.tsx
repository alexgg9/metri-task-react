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
  useColorModeValue
} from '@chakra-ui/react';
import { FiCheckCircle, FiActivity, FiClock } from 'react-icons/fi';

interface UserStatsCardProps {
  stats: {
    projectsCompleted: number;
    tasksCompleted: number;
    projectsInProgress: number;
  };
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ stats }) => {
  const statCardBg = useColorModeValue('white', 'gray.700');

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
        <StatGroup>
          <Stat>
            <HStack>
              <Icon as={FiCheckCircle} color="green.500" />
              <StatLabel>Proyectos Completados</StatLabel>
            </HStack>
            <StatNumber>{stats.projectsCompleted}</StatNumber>
          </Stat>
        </StatGroup>
        
        <Divider my={3} />
        
        <StatGroup>
          <Stat>
            <HStack>
              <Icon as={FiActivity} color="blue.500" />
              <StatLabel>Tareas Completadas</StatLabel>
            </HStack>
            <StatNumber>{stats.tasksCompleted}</StatNumber>
          </Stat>
        </StatGroup>
        
        <Divider my={3} />
        
        <StatGroup>
          <Stat>
            <HStack>
              <Icon as={FiClock} color="orange.500" />
              <StatLabel>Proyectos Activos</StatLabel>
            </HStack>
            <StatNumber>{stats.projectsInProgress}</StatNumber>
          </Stat>
        </StatGroup>
      </CardBody>
    </Card>
  );
};

export default UserStatsCard;