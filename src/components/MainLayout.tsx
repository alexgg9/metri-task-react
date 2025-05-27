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
      <Box 
        ml={sidebarWidth} 
        w={`calc(100% - ${sidebarWidth})`} 
        h="100vh" 
        position="relative"
        transition="all 0.2s"
      >
        <Topbar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        <Box 
          pt="64px"
          h="calc(100vh - 64px)"
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