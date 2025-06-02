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
  Avatar,
} from '@chakra-ui/react';
import { FiCheckCircle, FiClock, FiUsers, FiBarChart2, FiGithub, FiLinkedin, FiFlag } from 'react-icons/fi';

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
                      to="/auth?tab=register"
                      size="lg"
                      colorScheme="blue"
                      px={8}
                      rounded="full"
                      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                    >
                      Crear Cuenta
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/auth?tab=login"
                      size="lg"
                      variant="outline"
                      colorScheme="blue"
                      px={8}
                      rounded="full"
                    >
                      Iniciar Sesión
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
        {/* Features Section */}
        <Container maxW="container.xl" py={20}>
          <Stack spacing={12}>
            <Stack spacing={8} align="center" textAlign="center">
              <Heading
                fontSize={{ base: '3xl', md: '4xl' }}
                bgGradient="linear(to-r, blue.400, blue.600)"
                bgClip="text"
                fontWeight="extrabold"
                className="modern-font"
              >
                Potencia Tu Productividad
              </Heading>
              <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                color={useColorModeValue('gray.600', 'gray.400')}
                maxW="2xl"
                className="modern-font"
                fontWeight="500"
              >
                Descubre las herramientas clave que harán tu gestión de proyectos más eficiente.
              </Text>
            </Stack>

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
          </Stack>
        </Container>

        {/* App Screenshots Section */}
        <Box py={20}>
          <Stack spacing={12}>
            <Stack spacing={8} align="center" textAlign="center">
              <Heading
                fontSize={{ base: '3xl', md: '4xl' }}
                bgGradient="linear(to-r, blue.400, blue.600)"
                bgClip="text"
                fontWeight="extrabold"
                className="modern-font"
              >
                Descubre MetriTask
              </Heading>
              <Text 
                fontSize={{ base: 'lg', md: 'xl' }} 
                color={useColorModeValue('gray.600', 'gray.400')} 
                maxW="2xl"
                className="modern-font"
                fontWeight="500"
              >
                Una experiencia intuitiva y moderna para gestionar tus proyectos
              </Text>
            </Stack>

            {/* Gestión de Usuarios Section */}
            <Box pt={10}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <Stack spacing={6} justify="center">
                  <Heading
                    fontSize={{ base: '2xl', md: '3xl' }}
                    className="modern-font"
                    bgGradient="linear(to-r, blue.400, blue.600)"
                    bgClip="text"
                  >
                    Gestión de Usuarios
                  </Heading>
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>
                    Invita a tu equipo, asigna roles y permisos, y mantén un control total sobre quién puede acceder a qué.
                  </Text>
                  <SimpleGrid columns={2} spacing={4}>
                    <Stack spacing={2}>
                      <Icon as={FiUsers} w={6} h={6} color="blue.500" />
                      <Text fontWeight="medium">Roles Personalizados</Text>
                    </Stack>
                    <Stack spacing={2}>
                      <Icon as={FiCheckCircle} w={6} h={6} color="blue.500" />
                      <Text fontWeight="medium">Permisos Granulares</Text>
                    </Stack>
                  </SimpleGrid>
                </Stack>
                <Box
                  h="400px"
                  overflow="hidden"
                  position="relative"
                  borderRadius="2xl"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bg: 'linear-gradient(135deg, rgba(66, 153, 225, 0.15) 0%, rgba(49, 130, 206, 0.25) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    borderRadius: '2xl',
                  }}
                >
                  <Image
                    src="/users.png"
                    alt="Gestión de Usuarios"
                    w="full"
                    h="full"
                    objectFit="contain"
                    objectPosition="center top"
                    transition="all 0.3s"
                    _hover={{ filter: 'brightness(1.1)' }}
                    borderRadius="2xl"
                  />
                </Box>
              </SimpleGrid>
            </Box>

            {/* Project Details Section */}
            <Box pt={10}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <Box
                  h="400px"
                  overflow="hidden"
                  position="relative"
                  borderRadius="2xl"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bg: 'linear-gradient(135deg, rgba(66, 153, 225, 0.15) 0%, rgba(49, 130, 206, 0.25) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    borderRadius: '2xl',
                  }}
                >
                  <Image
                    src="/project-details.png"
                    alt="Detalles del Proyecto"
                    w="full"
                    h="full"
                    objectFit="contain"
                    objectPosition="center"
                    transition="all 0.3s"
                    _hover={{ filter: 'brightness(1.1)' }}
                    borderRadius="2xl"
                  />
                </Box>
                <Stack spacing={6} justify="center">
                  <Heading
                    fontSize={{ base: '2xl', md: '3xl' }}
                    className="modern-font"
                    bgGradient="linear(to-r, blue.400, blue.600)"
                    bgClip="text"
                  >
                    Detalles del Proyecto
                  </Heading>
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>
                    Visualiza toda la información importante de tus proyectos en un solo lugar. Seguimiento de progreso, tareas pendientes y miembros del equipo.
                  </Text>
                  <SimpleGrid columns={2} spacing={4}>
                    <Stack spacing={2}>
                      <Icon as={FiBarChart2} w={6} h={6} color="blue.500" />
                      <Text fontWeight="medium">Seguimiento en Tiempo Real</Text>
                    </Stack>
                    <Stack spacing={2}>
                      <Icon as={FiClock} w={6} h={6} color="blue.500" />
                      <Text fontWeight="medium">Gestión de Tareas</Text>
                    </Stack>
                  </SimpleGrid>
                </Stack>
              </SimpleGrid>
            </Box>

            {/* Kanban Section */}
            <Box pt={10}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <Stack spacing={6} justify="center">
                  <Heading
                    fontSize={{ base: '2xl', md: '3xl' }}
                    className="modern-font"
                    bgGradient="linear(to-r, blue.400, blue.600)"
                    bgClip="text"
                  >
                    Vista Kanban
                  </Heading>
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>
                    Organiza tus tareas de forma visual con nuestro tablero Kanban. Arrastra y suelta para mover tareas entre estados y mantén un control visual del progreso.
                  </Text>
                  <SimpleGrid columns={2} spacing={4}>
                    <Stack spacing={2}>
                      <Icon as={FiCheckCircle} w={6} h={6} color="blue.500" />
                      <Text fontWeight="medium">Drag & Drop</Text>
                    </Stack>
                    <Stack spacing={2}>
                      <Icon as={FiUsers} w={6} h={6} color="blue.500" />
                      <Text fontWeight="medium">Colaboración en Tiempo Real</Text>
                    </Stack>
                  </SimpleGrid>
                </Stack>
                <Box
                  h="400px"
                  overflow="hidden"
                  position="relative"
                  borderRadius="2xl"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bg: 'linear-gradient(135deg, rgba(66, 153, 225, 0.15) 0%, rgba(49, 130, 206, 0.25) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    borderRadius: '2xl',
                  }}
                >
                  <Image
                    src="/kanban.png"
                    alt="Vista Kanban"
                    w="full"
                    h="full"
                    objectFit="contain"
                    objectPosition="center"
                    transition="all 0.3s"
                    _hover={{ filter: 'brightness(1.1)' }}
                    borderRadius="2xl"
                  />
                </Box>
              </SimpleGrid>
            </Box>
          </Stack>
        </Box>

        {/* Developer Section */}
        <Box py={20}>
          <Stack spacing={8} align="center" textAlign="center">
            <Heading
              fontSize={{ base: '3xl', md: '4xl' }}
              bgGradient="linear(to-r, blue.400, blue.600)"
              bgClip="text"
              fontWeight="extrabold"
              className="modern-font"
            >
              Conoce al Desarrollador
            </Heading>
            
            <Box
              p={0}
              bg={useColorModeValue('white', 'gray.800')}
              rounded="2xl"
              shadow="xl"
              maxW="2xl"
              maxH="200px"
              overflow="hidden"
            >
              <Flex align="center" p={2}>
                <Box
                  w="180px"
                  h="180px"
                  overflow="hidden"
                  rounded="full"
                  border="4px solid"
                  borderColor="blue.500"
                >
                  <Image
                    src="/me.png"
                    alt="Alex"
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
                <Stack spacing={1} ml={4} flex={1}>
                  <Heading size="lg" className="modern-font">Alex</Heading>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue('gray.600', 'gray.400')}
                    fontStyle="italic"
                    className="modern-font"
                  >
                    "Creo en la simplicidad y la eficiencia. MetriTask nació de la necesidad de tener una herramienta que realmente ayude a los equipos a ser más productivos."
                  </Text>
                  <HStack spacing={4}>
                    <Button
                      as="a"
                      href="https://github.com/alexgg9"
                      target="_blank"
                      leftIcon={<FiGithub />}
                      variant="ghost"
                      colorScheme="blue"
                      size="xs"
                    >
                      GitHub
                    </Button>
                    <Button
                      as="a"
                      href="https://linkedin.com/in/alejandro-gálvez-garcía"
                      target="_blank"
                      leftIcon={<FiLinkedin />}
                      variant="ghost"
                      colorScheme="blue"
                      size="xs"
                    >
                      LinkedIn
                    </Button>
                  </HStack>
                </Stack>
              </Flex>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;


