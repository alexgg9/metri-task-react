import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  Text,
  Heading,
  Icon,
} from '@chakra-ui/react';
import {
  FiHome,
  FiFolder,
  FiFileText
} from 'react-icons/fi';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const primaryColor = 'blue.500';
  const bgColor = 'white';
  const borderColor = 'gray.200';
  
  const sidebarWidth = collapsed ? '70px' : '200px';
  
  const menuItems = [
    {
      path: '/',
      icon: FiHome,
      label: 'Dashboard'
    },
    {
      path: '/projects',
      icon: FiFolder,
      label: 'Proyectos'
    },
    {
      path: '/tasks',
      icon: FiFileText,
      label: 'Tareas'
    }
  ];

  return (
    <Box
      as="aside"
      position="fixed"
      left={0}
      top={0}
      bottom={0}
      width={sidebarWidth}
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
          <Icon as={FiHome} fontSize="20px" color={primaryColor} />
        ) : (
          <Heading size="md" color={primaryColor}>MetriTask</Heading>
        )}
      </Flex>

      {/* Navigation Menu */}
      <VStack gap={0} align="stretch" mt={2}>
        {menuItems.map((item) => {
          const CustomLink = React.forwardRef<HTMLAnchorElement>((props, ref) => (
            <Link to={item.path} ref={ref} {...props} />
          ));
          
          return (
            <Box 
              key={item.path}
              as={CustomLink}
              py={3}
              px={collapsed ? 0 : 4}
              display="flex"
              alignItems="center"
              justifyContent={collapsed ? "center" : "flex-start"}
              bg={location.pathname === item.path ? 'blue.50' : 'transparent'}
              color={location.pathname === item.path ? primaryColor : 'inherit'}
              _hover={{
                bg: 'gray.100',
                textDecoration: 'none'
              }}
              transition="all 0.2s"
            >
              <Icon as={item.icon} fontSize="18px" mr={collapsed ? 0 : 3} />
              {!collapsed && <Text fontSize="sm">{item.label}</Text>}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;