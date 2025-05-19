import React from 'react';
import { Box, Heading, Text, Button, VStack, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('gray.50', 'gray.900')}
      px={4}
    >
      <Box
        maxW="md"
        w="full"
        bg={bgColor}
        rounded="xl"
        p={8}
        shadow="lg"
        textAlign="center"
      >
        <VStack spacing={6}>
          <Box
            as={FiAlertTriangle}
            size="64px"
            color="orange.500"
          />
          
          <Heading size="lg" color="orange.500">
            Acceso No Autorizado
          </Heading>
          
          <Text color={textColor}>
            Lo sentimos, no tienes los permisos necesarios para acceder a esta página.
            Si crees que esto es un error, por favor contacta con un administrador.
          </Text>
          
          <Button
            colorScheme="blue"
            onClick={() => navigate('/projects')}
            size="lg"
            w="full"
          >
            Volver a Proyectos
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default UnauthorizedPage; 