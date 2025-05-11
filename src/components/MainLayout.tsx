import React, { ReactNode, useState } from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  
  const sidebarWidth = collapsed ? "80px" : "250px";
  
  return (
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar fijo */}
      <Box
        w={sidebarWidth}
        h="100vh"
        position="fixed"
        left={0}
        top={0}
        bg={useColorModeValue('white', 'gray.800')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
        zIndex={10}
        transition="width 0.2s"
      >
        <Sidebar collapsed={collapsed} />
      </Box>
      
      {/* Contenido principal con topbar fijo */}
      <Box 
        ml={sidebarWidth} 
        w={`calc(100% - ${sidebarWidth})`} 
        h="100vh" 
        position="relative"
        transition="all 0.2s"
      >
        {/* Topbar fijo */}
        <Box
          h="60px"
          position="fixed"
          top={0}
          right={0}
          left={sidebarWidth}
          bg={useColorModeValue('white', 'gray.800')}
          borderBottom="1px"
          borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
          zIndex={5}
          transition="left 0.2s"
        >
          <Topbar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        </Box>
        
        {/* Área de contenido con scroll */}
        <Box
          pt="60px"
          h="100vh"
          overflowY="auto"
          bg={bgColor}
          px={4}
        >
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default MainLayout;