import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Image,
  SimpleGrid,
  Icon,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { FiCheckCircle, FiClock, FiUsers, FiBarChart2 } from 'react-icons/fi';

// Añadir la fuente al head del documento
const fontStyle = document.createElement('style');
fontStyle.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  
  .modern-font {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
`;
document.head.appendChild(fontStyle);

const Feature = ({ icon, title, text }: { icon: React.ElementType; title: string; text: string }) => {
  return (
    <Stack
      spacing={4}
      align="center"
      textAlign="center"
      p={6}
      bg={useColorModeValue('white', 'gray.800')}
      rounded="xl"
      shadow="lg"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
    >
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="full"
        bg="blue.500"
        mb={1}
      >
        <Icon as={icon} w={10} h={10} />
      </Flex>
      <Text fontWeight={600} fontSize="xl">{title}</Text>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
    </Stack>
  );
};

const Landing: React.FC = () => {
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, white)',
    'linear(to-br, gray.900, gray.800)'
  );

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="sm:text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24">
                      <img src="/logo.svg" alt="MetriTask Logo" className="w-20 h-20 object-contain" />
                    </div>
                  </div>
                  <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl modern-font">
                    <span className="block">Gestiona tus proyectos</span>
                    <span className="block text-blue-400">con MetriTask</span>
                  </h1>
                  <Text 
                    fontSize={{ base: 'lg', md: 'xl' }} 
                    color={useColorModeValue('gray.600', 'gray.400')} 
                    maxW="2xl" 
                    className="mt-6 modern-font"
                    fontWeight="500"
                  >
                    MetriTask te ayuda a organizar tus tareas, colaborar con tu equipo y alcanzar tus objetivos de manera más eficiente.
                  </Text>
                  <Stack direction={{ base: 'column', md: 'row' }} spacing={4} className="mt-8">
                    <Button
                      as={RouterLink}
                      to="/auth"
                      size="lg"
                      colorScheme="blue"
                      px={8}
                      rounded="full"
                      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                    >
                      Comenzar Gratis
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/auth"
                      size="lg"
                      variant="outline"
                      colorScheme="blue"
                      px={8}
                      rounded="full"
                    >
                      Ver Demo
                    </Button>
                  </Stack>
                </div>

                <div className="mt-12 lg:mt-0 relative">
                  <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                    <div className="relative w-full h-[400px] rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                        <img
                          src="/mockup.png"
                          alt="MetriTask App Mockup"
                          className="w-full h-full object-contain scale-100"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl"></div>
                    <div className="absolute -top-6 -left-6 w-72 h-72 bg-blue-400/20 rounded-full filter blur-3xl"></div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <Container maxW="container.xl" pt={32} pb={20}>
        <Stack spacing={8} align="center" textAlign="center">
          <Heading
            fontSize={{ base: '4xl', md: '6xl' }}
            bgGradient="linear(to-r, blue.400, blue.600)"
            bgClip="text"
            fontWeight="extrabold"
            className="modern-font"
          >
            Gestiona tus proyectos con eficiencia
          </Heading>
          <Text 
            fontSize={{ base: 'lg', md: 'xl' }} 
            color={useColorModeValue('gray.600', 'gray.400')} 
            maxW="2xl"
            className="modern-font"
            fontWeight="500"
          >
            MetriTask te ayuda a organizar tus tareas, colaborar con tu equipo y alcanzar tus objetivos de manera más eficiente.
          </Text>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <Button
              as={RouterLink}
              to="/auth"
              size="lg"
              colorScheme="blue"
              px={8}
              rounded="full"
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            >
              Comenzar Gratis
            </Button>
            <Button
              as={RouterLink}
              to="/auth"
              size="lg"
              variant="outline"
              colorScheme="blue"
              px={8}
              rounded="full"
            >
              Ver Demo
            </Button>
          </Stack>
        </Stack>

        {/* Features Section */}
        <Box py={20}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <Feature
              icon={FiCheckCircle}
              title="Gestión de Tareas"
              text="Organiza y prioriza tus tareas de manera eficiente con nuestro sistema intuitivo."
            />
            <Feature
              icon={FiClock}
              title="Seguimiento de Tiempo"
              text="Monitorea el tiempo dedicado a cada tarea y proyecto para optimizar tu productividad."
            />
            <Feature
              icon={FiUsers}
              title="Colaboración en Equipo"
              text="Trabaja en equipo de manera efectiva con herramientas de colaboración integradas."
            />
            <Feature
              icon={FiBarChart2}
              title="Análisis y Reportes"
              text="Obtén insights valiosos sobre el progreso y rendimiento de tus proyectos."
            />
          </SimpleGrid>
        </Box>

        {/* CTA Section */}
        <Box
          mt={20}
          p={10}
          bg={useColorModeValue('blue.50', 'blue.900')}
          rounded="2xl"
          shadow="xl"
        >
          <Stack spacing={8} align="center" textAlign="center">
            <Heading size="xl" className="modern-font">¿Listo para comenzar?</Heading>
            <Text 
              fontSize="lg" 
              color={useColorModeValue('gray.600', 'gray.400')}
              className="modern-font"
              fontWeight="500"
            >
              Únete a miles de equipos que ya están usando MetriTask para mejorar su productividad.
            </Text>
            <Button
              as={RouterLink}
              to="/auth"
              size="lg"
              colorScheme="blue"
              px={8}
              rounded="full"
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            >
              Crear Cuenta Gratis
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;

