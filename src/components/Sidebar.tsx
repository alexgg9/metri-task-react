import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  Text,
  Heading,
  Icon,
  useColorModeValue,
  Tooltip,
  Divider
} from '@chakra-ui/react';
import {
  FiHome,
  FiFolder,
  FiBarChart2
} from 'react-icons/fi';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const primaryColor = useColorModeValue('blue.500', 'blue.300');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('blue.50', 'blue.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  
  const menuItems = [
    {
      path: '/projects',
      icon: FiFolder,
      label: 'Proyectos'
    },
    {
      path: '/statistics',
      icon: FiBarChart2,
      label: 'Estadísticas'
    }
  ];

  return (
    <Box
      as="aside"
      position="fixed"
      left={0}
      top={0}
      bottom={0}
      width={collapsed ? "80px" : "250px"}
      bg={bgColor}
      boxShadow="sm"
      borderRight="1px"
      borderRightColor={borderColor}
      transition="width 0.2s ease"
      overflowX="hidden"
      overflowY="auto"
      zIndex={10}
    >
      {/* Logo / Brand */}
      <Flex
        height="64px"
        alignItems="center"
        justifyContent={collapsed ? "center" : "flex-start"}
        paddingX={collapsed ? 0 : 4}
        borderBottom="1px"
        borderBottomColor={borderColor}
      >
        {collapsed ? (
          <Icon as={FiHome} fontSize="24px" color={primaryColor} />
        ) : (
          <Heading size="md" color={primaryColor}>MetriTask</Heading>
        )}
      </Flex>

      <Divider borderColor={borderColor} display={collapsed ? "none" : "block"} />

      {/* Navigation Menu */}
      <VStack spacing={1} align="stretch" p={4}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const CustomLink = React.forwardRef<HTMLAnchorElement>((props, ref) => (
            <Link to={item.path} ref={ref} {...props} />
          ));
          
          return (
            <Tooltip
              key={item.path}
              label={item.label}
              placement="right"
              isDisabled={!collapsed}
            >
              <Box 
                as={CustomLink}
                py={3}
                px={collapsed ? 3 : 4}
                display="flex"
                alignItems="center"
                justifyContent={collapsed ? "center" : "flex-start"}
                bg={isActive ? hoverBg : 'transparent'}
                color={isActive ? primaryColor : textColor}
                borderRadius="lg"
                position="relative"
                _hover={{
                  bg: hoverBg,
                  transform: 'translateX(3px)',
                  transition: 'all 0.2s'
                }}
                transition="all 0.2s"
              >
                {isActive && (
                  <Box
                    position="absolute"
                    left={0}
                    top={0}
                    bottom={0}
                    w="4px"
                    bg={primaryColor}
                    borderRightRadius="md"
                  />
                )}
                <Icon 
                  as={item.icon} 
                  fontSize="20px" 
                  mr={collapsed ? 0 : 3} 
                  color={isActive ? primaryColor : textColor}
                />
                {!collapsed && (
                  <Text 
                    fontSize="sm" 
                    fontWeight={isActive ? "semibold" : "medium"}
                  >
                    {item.label}
                  </Text>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;