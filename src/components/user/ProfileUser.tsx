import React, { useEffect, useState } from 'react';
import {
  Container,
  useToast,
  Center,
  Spinner,
  Text,
  Grid,
  GridItem,
  VStack
} from '@chakra-ui/react';
import { getCurrentUser } from '../../services/userService';
import { getProjects } from '../../services/projectService';
import { getTasks } from '../../services/taskService';
import { User, UserUpdate } from '@/types/user';
import { Project } from '@/types/project';
import UserProfileCard from './UserProfileCard';
import UserInfoForm from './UserInfoForm';
import UserStatsCard from './UserStatsCard';

const ProfileUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserUpdate>({
    password: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    projectsCompleted: 0,
    tasksCompleted: 0,
    projectsInProgress: 0,
    totalProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    joinDate: ''
  });
  const toast = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setFormData(userData);
        
        const joinDate = new Date(userData.created_at || Date.now());
        const formattedDate = joinDate.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        
        await fetchUserStats(userData.id, formattedDate);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los datos del usuario',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchUserData();
  }, [toast]);

  const fetchUserStats = async (userId: number, joinDate: string) => {
    try {
      const projects: Project[] = await getProjects();
      
      const userProjects = Array.isArray(projects) 
        ? projects.filter(project => 
            (project.users && project.users.some(u => u.id === userId)) ||
            (project.creator && project.creator.id === userId) ||
            project.user_id === userId
          )
        : [];
      
      const completedProjects = userProjects.filter(project => 
        project.status && (
          project.status.toLowerCase().includes('complet') || 
          project.status.toLowerCase().includes('done') || 
          project.status.toLowerCase().includes('termin')
        )
      ).length;
      
      const inProgressProjects = userProjects.length - completedProjects;
  
      const tasksResponse = await getTasks();
      const tasks = Array.isArray(tasksResponse) ? tasksResponse : [];
      
      const userTasks = tasks.filter(task => {
        if (!task) return false;
        
        // Verificar si el usuario está asignado a la tarea
        const isAssigned = task.assigned_to && task.assigned_to.id === userId;
        
        // Verificar si el usuario es el creador de la tarea
        const isCreator = task.created_by && task.created_by.id === userId;
        
        return isAssigned || isCreator;
      });
      
      const completedTasks = userTasks.filter(task => 
        task && task.status && (
          task.status.toLowerCase().includes('complet') || 
          task.status.toLowerCase().includes('done') || 
          task.status.toLowerCase().includes('termin')
        )
      ).length;
      
      const totalProjects = userProjects.length;
      const totalTasks = userTasks.length;
      const pendingTasks = totalTasks - completedTasks;
      
      setUserStats({
        projectsCompleted: completedProjects,
        tasksCompleted: completedTasks,
        projectsInProgress: inProgressProjects,
        totalProjects,
        totalTasks,
        pendingTasks,
        joinDate
      });
      
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      setUserStats(prev => ({
        ...prev,
        joinDate
      }));
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (!user) {
    return (
      <Container maxW="container.lg" py={10}>
        <Center h="50vh" flexDirection="column" gap={4}>
          <Spinner 
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Text fontSize="lg" color="gray.500" mt={2}>
            Cargando perfil...
          </Text>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Grid templateColumns={{ base: "1fr", lg: "300px 1fr" }} gap={6}>
        <GridItem>
          <VStack spacing={6} align="stretch">
            <UserProfileCard 
              user={user} 
              joinDate={userStats.joinDate} 
            />
            
            <UserStatsCard 
              stats={userStats}
            />
          </VStack>
        </GridItem>
        
        <GridItem>
          <UserInfoForm
            user={user}
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onUserUpdate={handleUserUpdate}
          />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default ProfileUser;