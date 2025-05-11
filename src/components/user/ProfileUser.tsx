import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Avatar,
  Text,
  useToast,
  Divider,
  Card,
  CardBody,
  IconButton,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  HStack,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiX, FiEye, FiEyeOff, FiUser, FiMail } from 'react-icons/fi';
import { getCurrentUser, updateUser } from '../../services/userService';
import { User, UserUpdate } from '@/types/user';

const ProfileUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserUpdate>({
    password: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const inputBgReadOnly = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setFormData(userData);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password) {
      toast({
        title: 'Contraseña requerida',
        description: 'Debes ingresar tu contraseña para actualizar el perfil',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);

    try {
      if (user && user.id) {
        await updateUser(user.id, formData);
        
        const { password, ...userDataWithoutPassword } = formData;
        setUser({...user, ...userDataWithoutPassword});
        
        setIsEditing(false);
        toast({
          title: 'Perfil actualizado',
          description: 'Los datos de tu perfil se han actualizado correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Limpiar la contraseña del formulario
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil. Verifica que la contraseña sea correcta.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({...user, password: ''});
    setIsEditing(false);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  if (!user) {
    return (
      <Container maxW="container.md" py={10}>
        <Card variant="outline" bg={cardBg} shadow="md">
          <CardBody>
            <Flex justify="center" align="center" h="200px">
              <Text fontSize="lg">Cargando datos del usuario...</Text>
            </Flex>
          </CardBody>
        </Card>
      </Container>
    );
  }

  const getRoleBadge = (role: string) => {
    let color;
    switch(role) {
      case 'admin':
        color = 'red';
        break;
      case 'manager':
        color = 'purple';
        break;
      case 'member':
        color = 'green';
        break;
      default:
        color = 'gray';
    }
    
    return (
      <Badge colorScheme={color} px={2} py={1} borderRadius="md">
        {role === 'admin' ? 'Administrador' : 
         role === 'manager' ? 'Manager' :
         role === 'member' ? 'Miembro' : role}
      </Badge>
    );
  };

  return (
    <Container maxW="container.md" py={10}>
      <Tabs variant="soft-rounded" colorScheme="blue" mb={6}>
        <TabList>
          <Tab>Perfil</Tab>
          <Tab>Preferencias</Tab>
        </TabList>
        
        <TabPanels mt={4}>
          <TabPanel p={0}>
            <Card mb={6} variant="outline" bg={cardBg} shadow="md" overflow="hidden">
              <Box 
                h="100px" 
                bg="blue.500" 
                position="relative"
              />
              <CardBody pt={0} mt={-50}>
                <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={6}>
                  <Avatar 
                    size="2xl" 
                    name={user.name} 
                    src={user.avatar} 
                    bg="blue.500"
                    border="4px solid white"
                    mb={{ base: 2, md: 0 }}
                  />
                  <Box flex={1}>
                    <Heading size="lg" mb={2}>{user.name}</Heading>
                    <HStack spacing={2} mb={2}>
                      <FiMail />
                      <Text color={textColor}>{user.email}</Text>
                    </HStack>
                    {user.role && (
                      <HStack spacing={2}>
                        <FiUser />
                        {getRoleBadge(user.role)}
                      </HStack>
                    )}
                  </Box>
                  {!isEditing && (
                    <IconButton
                      aria-label="Editar perfil"
                      icon={<FiEdit />}
                      onClick={() => setIsEditing(true)}
                      colorScheme="blue"
                      variant="outline"
                    />
                  )}
                </Flex>
              </CardBody>
            </Card>

            <Card variant="outline" bg={cardBg} shadow="md">
              <CardBody>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">Información personal</Heading>
                  {isEditing && (
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Cancelar"
                        icon={<FiX />}
                        onClick={handleCancel}
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                      />
                      <IconButton
                        aria-label="Guardar"
                        icon={<FiSave />}
                        onClick={handleSubmit}
                        colorScheme="green"
                        isLoading={isLoading}
                        size="sm"
                      />
                    </HStack>
                  )}
                </Flex>
                
                <Divider mb={6} />
                
                <form onSubmit={handleSubmit}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel>Nombre</FormLabel>
                      <InputGroup>
                        <Input
                          name="name"
                          value={formData.name || ''}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                          bg={!isEditing ? inputBgReadOnly : undefined}
                          borderColor={borderColor}
                          _hover={isEditing ? { borderColor: 'blue.300' } : undefined}
                        />
                      </InputGroup>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Correo electrónico</FormLabel>
                      <Input
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        bg={!isEditing ? inputBgReadOnly : undefined}
                        borderColor={borderColor}
                        _hover={isEditing ? { borderColor: 'blue.300' } : undefined}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Teléfono</FormLabel>
                      <InputGroup>
                        <Input
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                          bg={!isEditing ? inputBgReadOnly : undefined}
                          borderColor={borderColor}
                          _hover={isEditing ? { borderColor: 'blue.300' } : undefined}
                        />
                      </InputGroup>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Dirección</FormLabel>
                      <Input
                        name="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        bg={!isEditing ? inputBgReadOnly : undefined}
                        borderColor={borderColor}
                        _hover={isEditing ? { borderColor: 'blue.300' } : undefined}
                      />
                    </FormControl>
                    
                    {isEditing && (
                      <FormControl gridColumn={{ md: 'span 2' }}>
                        <FormLabel>Contraseña actual (requerida para guardar cambios)</FormLabel>
                        <InputGroup>
                          <Input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password || ''}
                            onChange={handleInputChange}
                            borderColor={borderColor}
                            _hover={{ borderColor: 'blue.300' }}
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                              icon={showPassword ? <FiEyeOff /> : <FiEye />}
                              onClick={togglePasswordVisibility}
                              variant="ghost"
                              size="sm"
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                    )}
                  </SimpleGrid>
                </form>
              </CardBody>
            </Card>
          </TabPanel>
          
          <TabPanel>
            <Card variant="outline" bg={cardBg} shadow="md">
              <CardBody>
                <Heading size="md" mb={4}>Preferencias de usuario</Heading>
                <Divider mb={6} />
                <Text color={textColor}>Las preferencias de usuario estarán disponibles próximamente.</Text>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ProfileUser;