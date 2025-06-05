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
import UserProfileCard from './UserProfileCard';
import UserInfoForm from './UserInfoForm';
import UserStatsCard from './UserStatsCard';

const ProfileUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserUpdate>({
    password: '' 
  });
  const [isLoading, setIsLoading] = useState(true);
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
    const fetchAllData = async () => {
      setIsLoading(true);
      try {

        const userData = await getCurrentUser();
        if (!userData) {
          throw new Error('No se pudo obtener la información del usuario');
        }
        setUser(userData);
        setFormData(userData);
        
        const joinDate = new Date(userData.created_at || Date.now());
        const formattedDate = joinDate.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });

        const [projects, tasks] = await Promise.all([
          getProjects(),
          getTasks()
        ]);

        const userProjects = Array.isArray(projects) 
          ? projects.filter(project => 
              (project.users && project.users.some(u => u.id === userData.id)) ||
              (project.creator && project.creator.id === userData.id) ||
              project.user_id === userData.id
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
  
        const userTasks = Array.isArray(tasks) 
          ? tasks.filter(task => {
              if (!task) return false;
              const isAssigned = task.assigned_to && task.assigned_to.id === userData.id;
              const isCreator = task.created_by && task.created_by.id === userData.id;
              return isAssigned || isCreator;
            })
          : [];
        
        // Calcular estadísticas de tareas
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
          joinDate: formattedDate
        });
        
      } catch (error) {
        console.error('Error al cargar datos del perfil:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los datos del perfil',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [toast]);

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (isLoading) {
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

  if (!user) {
    return (
      <Container maxW="container.lg" py={10}>
        <Center h="50vh" flexDirection="column" gap={4}>
          <Text fontSize="lg" color="red.500">
            No se pudo cargar el perfil del usuario
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