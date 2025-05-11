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
} from '@chakra-ui/react';
import { FiMenu, FiX, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { getCurrentUser } from '../services/userService';
import { logout } from '../services/authService';

interface TopbarProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ collapsed, toggleCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('Usuario');

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
      return <Text fontWeight="medium">Dashboard</Text>;
    }

    return (
      <Flex align="center">
        <Box as={Link} to="/" color="gray.600" _hover={{ color: 'blue.500' }}>
          Dashboard
        </Box>
        {pathSnippets.map((segment, index) => {
          const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSnippets.length - 1;
          const name = pathMap[url] || segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <React.Fragment key={url}>
              <Text mx={2} color="gray.400">/</Text>
              {isLast ? (
                <Text color="blue.500" fontWeight="medium">{name}</Text>
              ) : (
                <Box as={Link} to={url} color="gray.600" _hover={{ color: 'blue.500' }}>
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
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex={10}
      width="100%"
    >
      <Flex height="100%" align="center" justify="space-between">
        {/* Botón de toggle + migas de pan */}
        <Flex align="center">
          <IconButton
            icon={collapsed ? <FiMenu /> : <FiX />}
            onClick={toggleCollapsed}
            variant="ghost"
            aria-label="Toggle Sidebar"
            mr={4}
          />
          {renderBreadcrumbs()}
        </Flex>

        {/* Menú de usuario */}
        <Menu>
          <MenuButton as={Button} variant="ghost" p={2}>
            <Flex align="center">
              <Avatar size="sm" name={userName} mr={2} />
              <Text>{userName}</Text>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem 
              icon={<FiUser />} 
              as={Link} 
              to="/profile"
            >
              Perfil
            </MenuItem>
            <MenuItem icon={<FiSettings />}>Configuración</MenuItem>
            <MenuDivider />
            <MenuItem 
              icon={<FiLogOut />} 
              color="red.500"
              onClick={handleLogout}
            >
              Cerrar sesión
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default Topbar;