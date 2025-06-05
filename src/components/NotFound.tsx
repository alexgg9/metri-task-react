import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  useColorModeValue,
  Icon
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.xl" py={10}>
      <Box
        bg={bgColor}
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <VStack spacing={6} align="center">
          <Heading size="xl" color={textColor}>404</Heading>
          <Heading size="lg" color={textColor}>Página no encontrada</Heading>
          <Text color={textColor} textAlign="center">
            Lo sentimos, la página que estás buscando no existe o no tienes acceso a ella.
          </Text>
          <Button
            leftIcon={<Icon as={FiArrowLeft} />}
            colorScheme="blue"
            onClick={() => navigate('/projects')}
            size="lg"
          >
            Volver a Proyectos
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default NotFound; 