import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Card,
  CardBody,
  VStack,
  Text,
  Flex,
  Icon
} from '@chakra-ui/react';
import { FiBarChart2, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const Statistics: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" color={textColor}>Estadísticas</Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl">
            <CardBody>
              <Stat>
                <Flex align="center" mb={2}>
                  <Icon as={FiBarChart2} color="blue.500" boxSize={5} mr={2} />
                  <StatLabel color={textColor}>Proyectos Totales</StatLabel>
                </Flex>
                <StatNumber color={textColor}>12</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23.36%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl">
            <CardBody>
              <Stat>
                <Flex align="center" mb={2}>
                  <Icon as={FiCheckCircle} color="green.500" boxSize={5} mr={2} />
                  <StatLabel color={textColor}>Tareas Completadas</StatLabel>
                </Flex>
                <StatNumber color={textColor}>48</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  15.05%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl">
            <CardBody>
              <Stat>
                <Flex align="center" mb={2}>
                  <Icon as={FiClock} color="orange.500" boxSize={5} mr={2} />
                  <StatLabel color={textColor}>En Progreso</StatLabel>
                </Flex>
                <StatNumber color={textColor}>15</StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  9.05%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl">
            <CardBody>
              <Stat>
                <Flex align="center" mb={2}>
                  <Icon as={FiAlertCircle} color="red.500" boxSize={5} mr={2} />
                  <StatLabel color={textColor}>Pendientes</StatLabel>
                </Flex>
                <StatNumber color={textColor}>7</StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  12.05%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Box>
          <Text color={textColor} fontSize="lg" mb={4}>
            Aquí irán más estadísticas y gráficos en el futuro...
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default Statistics; 