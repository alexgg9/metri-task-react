import React from 'react';
import {
  Card,
  CardBody,
  Heading,
  Divider,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  HStack,
  Flex,
  SimpleGrid,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { User, UserUpdate } from '@/types/user';
import { updateUser } from '@/services/userService';

interface UserInfoFormProps {
  user: User;
  formData: UserUpdate;
  setFormData: React.Dispatch<React.SetStateAction<UserUpdate>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onUserUpdate: (user: User) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({
  user,
  formData,
  setFormData,
  isEditing,
  setIsEditing,
  isLoading,
  setIsLoading,
  onUserUpdate
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBgReadOnly = useColorModeValue('gray.50', 'gray.600');

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
        const updatedUser = {...user, ...userDataWithoutPassword};
        
        onUserUpdate(updatedUser);
        setIsEditing(false);
        
        toast({
          title: 'Perfil actualizado',
          description: 'Los datos de tu perfil se han actualizado correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
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

  return (
    <Card 
      variant="outline" 
      bg={cardBg} 
      shadow="md"
      borderRadius="xl"
      overflow="hidden"
    >
      <CardBody>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Información personal</Heading>
          {isEditing ? (
            <HStack spacing={2}>
              <Button
                leftIcon={<FiX />}
                onClick={handleCancel}
                colorScheme="red"
                variant="outline"
                size="sm"
                borderRadius="full"
              >
                Cancelar
              </Button>
              <Button
                leftIcon={<FiSave />}
                onClick={handleSubmit}
                colorScheme="green"
                isLoading={isLoading}
                size="sm"
                borderRadius="full"
              >
                Guardar
              </Button>
            </HStack>
          ) : (
            <Button
              leftIcon={<FiEdit />}
              onClick={() => setIsEditing(true)}
              colorScheme="blue"
              variant="outline"
              size="sm"
              borderRadius="full"
            >
              Editar
            </Button>
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
                  borderRadius="lg"
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
                borderRadius="lg"
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
                  borderRadius="lg"
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
                borderRadius="lg"
              />
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
                borderRadius="lg"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Fecha de nacimiento</FormLabel>
              <Input
                name="birthdate"
                type="date"
                value={formData.birthdate || ''}
                onChange={handleInputChange}
                readOnly={!isEditing}
                bg={!isEditing ? inputBgReadOnly : undefined}
                borderColor={borderColor}
                _hover={isEditing ? { borderColor: 'blue.300' } : undefined}
                borderRadius="lg"
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
                    borderRadius="lg"
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
  );
};

export default UserInfoForm;