import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  useColorMode,
  useColorModeValue,
  Tooltip,
  HStack,
} from '@chakra-ui/react';
import { FiMenu, FiX, FiUser, FiSettings, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { logout } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';

interface TopbarProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ collapsed, toggleCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, setUser } = useAuth();
  const { currentProject, loading } = useProject();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const breadcrumbColor = useColorModeValue('gray.600', 'gray.400');
  const breadcrumbActiveColor = useColorModeValue('blue.500', 'blue.300');
  const breadcrumbHoverColor = useColorModeValue('blue.600', 'blue.400');
  const breadcrumbSeparatorColor = useColorModeValue('gray.400', 'gray.600');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const pathMap: Record<string, string> = {
    '/': 'Proyectos',
    '/projects': 'Proyectos',
    '/statistics': 'Estadísticas',
    '/settings': 'Configuración',
  };

  const renderBreadcrumbs = () => {
    const pathSnippets = location.pathname.split('/').filter(Boolean);

    if (pathSnippets.length === 0 || (pathSnippets.length === 1 && pathSnippets[0] === 'projects')) {
      return <Text fontWeight="medium" color={textColor}>Inicio</Text>;
    }

    return (
      <Flex align="center">
        <Box 
          as={Link} 
          to="/projects" 
          color={breadcrumbColor} 
          _hover={{ color: breadcrumbHoverColor }}
          fontWeight="medium"
          fontSize="sm"
        >
          Inicio
        </Box>
        {pathSnippets.map((segment, index) => {
          const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSnippets.length - 1;
          
          let name = pathMap[url] || segment.charAt(0).toUpperCase() + segment.slice(1);
          
          if (pathSnippets[0] === 'projects' && index === 1 && !isNaN(Number(segment))) {
            if (loading) {
              name = 'Cargando...';
            } else {
              name = currentProject?.name || 'Proyecto';
            }
          }

          return (
            <React.Fragment key={url}>
              <Text mx={2} color={breadcrumbSeparatorColor}>/</Text>
              {isLast ? (
                <Text 
                  color={breadcrumbActiveColor} 
                  fontWeight="semibold" 
                  fontSize="sm"
                  opacity={loading ? 0.7 : 1}
                  transition="opacity 0.2s"
                >
                  {name}
                </Text>
              ) : (
                <Box 
                  as={Link} 
                  to={url} 
                  color={breadcrumbColor} 
                  _hover={{ color: breadcrumbHoverColor }}
                  fontWeight="medium"
                  fontSize="sm"
                >
                  {name}
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Flex>
    );
  };

  return (
    <Box
      px={4}
      height="64px"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={10}
      width="100%"
    >
      <Flex height="100%" align="center" justify="space-between">
        <Flex align="center">
          <IconButton
            icon={collapsed ? <FiMenu /> : <FiX />}
            onClick={toggleCollapsed}
            variant="ghost"
            aria-label="Toggle Sidebar"
            mr={4}
            color={textColor}
            _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
          />
          {renderBreadcrumbs()}
        </Flex>

        <HStack spacing={2}>
          <Tooltip label={colorMode === 'light' ? 'Modo oscuro' : 'Modo claro'}>
            <IconButton
              aria-label="Cambiar tema"
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
              color={textColor}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
            />
          </Tooltip>

          <Menu>
            <MenuButton 
              as={Button} 
              variant="ghost" 
              p={2}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
              borderRadius="md"
            >
              <Flex align="center">
                <Avatar 
                  size="sm" 
                  name={user?.name || 'Usuario'} 
                  mr={2}
                  bg={useColorModeValue('blue.500', 'blue.400')}
                  color="white"
                />
                <Text color={textColor}>{user?.name || 'Usuario'}</Text>
              </Flex>
            </MenuButton>
            <MenuList 
              shadow="lg" 
              borderRadius="md" 
              py={2}
              bg={useColorModeValue('white', 'gray.800')}
              borderColor={borderColor}
              minW="200px"
            >
              <MenuItem 
                icon={<FiUser />} 
                as={Link} 
                to="/profile"
                bg={useColorModeValue('white', 'gray.800')}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                _focus={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                borderRadius="md"
                mx={2}
                px={3}
                color={useColorModeValue('gray.700', 'white')}
              >
                Perfil
              </MenuItem>
              <MenuItem 
                icon={<FiSettings />}
                bg={useColorModeValue('white', 'gray.800')}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                _focus={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                borderRadius="md"
                mx={2}
                px={3}
                color={useColorModeValue('gray.700', 'white')}
              >
                Configuración
              </MenuItem>
              <MenuDivider 
                my={2} 
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              />
              <MenuItem 
                icon={<FiLogOut />} 
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('red.500', 'red.400')}
                onClick={handleLogout}
                _hover={{ bg: useColorModeValue('red.50', 'red.900') }}
                _focus={{ bg: useColorModeValue('red.50', 'red.900') }}
                borderRadius="md"
                mx={2}
                px={3}
              >
                Cerrar sesión
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Topbar;