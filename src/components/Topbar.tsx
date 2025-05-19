import React, { useEffect, useState } from 'react';
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
import { getCurrentUser } from '../services/userService';
import { logout } from '../services/authService';
import { getProjectById } from '../services/projectService';

interface TopbarProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ collapsed, toggleCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('Usuario');
  const { colorMode, toggleColorMode } = useColorMode();
  const [projectName, setProjectName] = useState<string>('');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const breadcrumbColor = useColorModeValue('gray.600', 'gray.400');
  const breadcrumbActiveColor = useColorModeValue('blue.500', 'blue.300');
  const breadcrumbHoverColor = useColorModeValue('blue.600', 'blue.400');
  const breadcrumbSeparatorColor = useColorModeValue('gray.400', 'gray.600');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getCurrentUser();
        if (userProfile && userProfile.name) {
          setUserName(userProfile.name);
        }
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const pathSnippets = location.pathname.split('/').filter(Boolean);
    if (pathSnippets[0] === 'projects' && pathSnippets[1] && !isNaN(Number(pathSnippets[1]))) {
      console.log('Detectada ruta de proyecto, ID:', pathSnippets[1]);
      const fetchProjectName = async () => {
        try {
          const projectId = Number(pathSnippets[1]);
          console.log('Obteniendo proyecto con ID:', projectId);
          const projectData = await getProjectById(projectId);
          console.log('Datos del proyecto:', projectData);
          if (projectData && projectData.name) {
            console.log('Nombre del proyecto obtenido:', projectData.name);
            setProjectName(projectData.name);
          }
        } catch (error) {
          console.error('Error al obtener el nombre del proyecto:', error);
          setProjectName('Proyecto');
        }
      };
      
      fetchProjectName();
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      navigate('/auth');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const pathMap: Record<string, string> = {
    '/': 'Dashboard',
    '/projects': 'Proyectos',
    '/tasks': 'Tareas',
    '/settings': 'Configuración',
  };

  const renderBreadcrumbs = () => {
    const pathSnippets = location.pathname.split('/').filter(Boolean);

    if (pathSnippets.length === 0) {
      return <Text fontWeight="medium" color={textColor}>Dashboard</Text>;
    }

    // Verificar si estamos en una ruta de proyecto y obtener el nombre
    let projectSegmentName = '';
    if (pathSnippets[0] === 'projects' && pathSnippets[1] && !isNaN(Number(pathSnippets[1]))) {
      projectSegmentName = projectName || 'Proyecto';
      console.log('Nombre del proyecto en breadcrumb:', projectSegmentName);
    }

    return (
      <Flex align="center">
        <Box 
          as={Link} 
          to="/" 
          color={breadcrumbColor} 
          _hover={{ color: breadcrumbHoverColor }}
          fontWeight="medium"
          fontSize="sm"
        >
          Dashboard
        </Box>
        {pathSnippets.map((segment, index) => {
          const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSnippets.length - 1;
          
          // Determinar el nombre a mostrar
          let name = pathMap[url] || segment.charAt(0).toUpperCase() + segment.slice(1);
          
          // Si estamos en el segmento del ID del proyecto, usar el nombre del proyecto
          if (pathSnippets[0] === 'projects' && index === 1 && !isNaN(Number(segment))) {
            name = projectSegmentName;
          }

          return (
            <React.Fragment key={url}>
              <Text mx={2} color={breadcrumbSeparatorColor}>/</Text>
              {isLast ? (
                <Text color={breadcrumbActiveColor} fontWeight="semibold" fontSize="sm">{name}</Text>
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
      transition="all 0.2s"
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
                  name={userName} 
                  mr={2}
                  bg={useColorModeValue('blue.500', 'blue.400')}
                  color="white"
                />
                <Text color={textColor}>{userName}</Text>
              </Flex>
            </MenuButton>
            <MenuList 
              shadow="lg" 
              borderRadius="md" 
              py={2}
              bg={bgColor}
              borderColor={borderColor}
            >
              <MenuItem 
                icon={<FiUser />} 
                as={Link} 
                to="/profile"
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                borderRadius="md"
                mx={2}
                px={3}
              >
                Perfil
              </MenuItem>
              <MenuItem 
                icon={<FiSettings />}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                borderRadius="md"
                mx={2}
                px={3}
              >
                Configuración
              </MenuItem>
              <MenuDivider my={2} />
              <MenuItem 
                icon={<FiLogOut />} 
                color="red.500"
                onClick={handleLogout}
                _hover={{ bg: useColorModeValue('red.50', 'red.900'), color: useColorModeValue('red.600', 'red.300') }}
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