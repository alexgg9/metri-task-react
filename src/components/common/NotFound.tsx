import React from 'react';
import { Box, Heading, Text, Button, VStack, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={bgColor}
    >
      <VStack spacing={6} textAlign="center" px={4}>
        <Heading
          fontSize={{ base: '6xl', md: '8xl' }}
          fontWeight="bold"
          color="blue.500"
        >
          404
        </Heading>
        <Heading size="lg" color={textColor}>
          Página no encontrada
        </Heading>
        <Text color={textColor} fontSize="lg">
          Lo sentimos, la página que estás buscando no existe.
        </Text>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => navigate('/projects')}
        >
          Volver al inicio
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFound; 