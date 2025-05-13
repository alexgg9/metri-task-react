import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Avatar,
  Heading,
  Badge,
  Divider,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';
import { User } from '@/types/user';

interface UserProfileCardProps {
  user: User;
  joinDate: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, joinDate }) => {
  const headerBg = useColorModeValue('blue.500', 'blue.600');
  const cardBg = useColorModeValue('white', 'gray.700');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  

  return (
    <Card 
      overflow="hidden" 
      variant="outline" 
      bg={cardBg} 
      shadow="md"
      borderRadius="xl"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
      mb={6}
    >
      <Box bg={headerBg} h="80px" />
      <CardBody pt={0} mt="-40px" textAlign="center">
        <VStack spacing={3}>
          <Avatar 
            size="xl" 
            name={user.name} 
            src={user.avatar} 
            border="4px solid white"
            bg="blue.500"
          />
          <Heading size="md">{user.name}</Heading>
          {user.role && (
            <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
              {(user.role)}
            </Badge>
          )}
          
          <Divider />
          
          <VStack spacing={2} align="start" w="full">
            <HStack>
              <Icon as={FiMail} color={accentColor} />
              <Text fontSize="sm">{user.email}</Text>
            </HStack>
            {user.phone && (
              <HStack>
                <Icon as={FiPhone} color={accentColor} />
                <Text fontSize="sm">{user.phone}</Text>
              </HStack>
            )}
            {user.address && (
              <HStack>
                <Icon as={FiMapPin} color={accentColor} />
                <Text fontSize="sm" noOfLines={1}>{user.address}</Text>
              </HStack>
            )}
            <HStack>
              <Icon as={FiCalendar} color={accentColor} />
              <Text fontSize="sm">Miembro desde {joinDate}</Text>
            </HStack>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default UserProfileCard;