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
  HStack,
} from '@chakra-ui/react';
import { FiGithub, FiLinkedin } from 'react-icons/fi';

// Añadir la fuente al head del documento
const fontStyle = document.createElement('style');
fontStyle.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  
  .modern-font {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
`;
document.head.appendChild(fontStyle);

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
                <div className="text-center lg:text-left">
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
                    className="mt-6 modern-font mx-auto lg:mx-0"
                    fontWeight="500"
                    textAlign={{ base: 'center', lg: 'left' }}
                  >
                    MetriTask te ayuda a organizar tus tareas, colaborar con tu equipo y alcanzar tus objetivos de manera más eficiente.
                  </Text>
                  <div className="flex flex-col items-center lg:items-start mt-8 space-y-4 lg:space-y-0 lg:space-x-4 lg:flex-row">
                    <Button
                      as={RouterLink}
                      to="/auth?tab=register"
                      size="lg"
                      colorScheme="blue"
                      px={8}
                      rounded="full"
                      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                      w={{ base: 'full', md: 'auto' }}
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
                      w={{ base: 'full', md: 'auto' }}
                    >
                      Iniciar Sesión
                    </Button>
                  </div>
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

      {/* Developer Section */}
      <Container maxW="container.xl" py={20}>
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
      </Container>
    </Box>
  );
};

export default Landing;


