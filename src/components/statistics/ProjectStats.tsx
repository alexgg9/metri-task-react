import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  GridItem,
  Heading,
  Card,
  CardBody,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Select,
  Flex,
  Spinner,
  Box,
  Text,
  Progress,
  HStack,
  Icon,
  List,
  ListItem,
  Badge
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { FiTrendingUp, FiCheckCircle, FiList } from 'react-icons/fi';
import { getProjects } from '../../services/projectService';
import { Project } from '@/types/project';
import { useAuth } from '../../contexts/AuthContext';

const COLORS = ['#3182CE', '#48BB78', '#ED8936'];

const ProjectStats: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const { user } = useAuth();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        const userProjects = data.filter(project => 
          (project.users && project.users.some(u => u.id === user?.id)) ||
          (project.creator && project.creator.id === user?.id) ||
          project.user_id === user?.id
        );
        setProjects(userProjects);
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  const calculateStats = () => {
    const totalProjects = projects.length;
    
    // Calcular total de tareas
    const totalTasks = projects.reduce((acc, project) => 
      acc + (project.tasks?.length || 0), 0
    );

    // Calcular tareas por estado
    const tasksByStatus = {
      pending: 0,
      'in progress': 0,
      completed: 0
    };

    // Calcular tareas por prioridad
    const tasksByPriority = {
      high: 0,
      medium: 0,
      low: 0
    };

    projects.forEach(project => {
      project.tasks?.forEach(task => {
        // Contar por estado
        tasksByStatus[task.status as keyof typeof tasksByStatus]++;
        // Contar por prioridad
        tasksByPriority[task.priority as keyof typeof tasksByPriority]++;
      });
    });

    // Calcular porcentaje de avance
    const completionRate = totalTasks > 0 
      ? (tasksByStatus.completed / totalTasks) * 100 
      : 0;

    // Preparar datos para gráficos
    const statusData = [
      { name: 'Pendientes', value: tasksByStatus.pending },
      { name: 'En Progreso', value: tasksByStatus['in progress'] },
      { name: 'Completadas', value: tasksByStatus.completed }
    ];

    const priorityData = [
      { name: 'Alta', value: tasksByPriority.high },
      { name: 'Media', value: tasksByPriority.medium },
      { name: 'Baja', value: tasksByPriority.low }
    ];

    return {
      totalProjects,
      totalTasks,
      tasksByStatus,
      tasksByPriority,
      completionRate,
      statusData,
      priorityData
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (stats.totalTasks === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <VStack spacing={4}>
              <Icon as={FiList} w={10} h={10} color="gray.400" />
              <Text fontSize="lg" color={textColor}>
                No hay tareas disponibles aún
              </Text>
              <Text color="gray.500">
                Las estadísticas aparecerán cuando se creen tareas en tus proyectos
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="lg" color={textColor}>Mis Estadísticas</Heading>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            w="200px"
            bg={bgColor}
            borderColor={borderColor}
          >
            <option value="all">Todo el tiempo</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
          </Select>
        </Flex>

        {/* Métricas principales */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
          <GridItem>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} h="100%">
              <CardBody>
                <Stat>
                  <HStack spacing={2} mb={2}>
                    <Icon as={FiTrendingUp} color="blue.500" />
                    <StatLabel color={textColor}>Proyectos Totales</StatLabel>
                  </HStack>
                  <StatNumber color={textColor}>{stats.totalProjects}</StatNumber>
                  <StatHelpText color={textColor}>
                    Proyectos asignados
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} h="100%">
              <CardBody>
                <Stat>
                  <HStack spacing={2} mb={2}>
                    <Icon as={FiList} color="purple.500" />
                    <StatLabel color={textColor}>Tareas Totales</StatLabel>
                  </HStack>
                  <StatNumber color={textColor}>{stats.totalTasks}</StatNumber>
                  <StatHelpText color={textColor}>
                    Tareas en todos los proyectos
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} h="100%">
              <CardBody>
                <Stat>
                  <HStack spacing={2} mb={2}>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <StatLabel color={textColor}>Avance General</StatLabel>
                  </HStack>
                  <StatNumber color={textColor}>{stats.completionRate.toFixed(1)}%</StatNumber>
                  <Progress
                    value={stats.completionRate}
                    size="sm"
                    colorScheme="green"
                    mt={2}
                  />
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Gráficos */}
        <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
          <GridItem>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Text fontSize="lg" fontWeight="medium" mb={4} color={textColor}>
                  Distribución por Estado
                </Text>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {stats.statusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Text fontSize="lg" fontWeight="medium" mb={4} color={textColor}>
                  Tareas por Prioridad
                </Text>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.priorityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`Total: ${value}`, 'Tareas']}
                        labelFormatter={(label) => `Prioridad ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="#3182CE" name="Tareas">
                        {stats.priorityData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Lista de prioridades */}
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Text fontSize="lg" fontWeight="medium" mb={4} color={textColor}>
              Resumen de Prioridades
            </Text>
            <List spacing={3}>
              <ListItem>
                <HStack justify="space-between">
                  <HStack>
                    <Badge colorScheme="red">Alta</Badge>
                    <Text color={textColor}>Prioridad Alta</Text>
                  </HStack>
                  <Text fontWeight="bold" color={textColor}>{stats.tasksByPriority.high} tareas</Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack justify="space-between">
                  <HStack>
                    <Badge colorScheme="orange">Media</Badge>
                    <Text color={textColor}>Prioridad Media</Text>
                  </HStack>
                  <Text fontWeight="bold" color={textColor}>{stats.tasksByPriority.medium} tareas</Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack justify="space-between">
                  <HStack>
                    <Badge colorScheme="green">Baja</Badge>
                    <Text color={textColor}>Prioridad Baja</Text>
                  </HStack>
                  <Text fontWeight="bold" color={textColor}>{stats.tasksByPriority.low} tareas</Text>
                </HStack>
              </ListItem>
            </List>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default ProjectStats; 