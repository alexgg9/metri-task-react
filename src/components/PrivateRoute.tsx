import React, { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Spinner, Center } from '@chakra-ui/react';

interface PrivateRouteProps {
  children: JSX.Element;
  requiredPermission?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredPermission }) => {
  const { user, loading, hasPermission } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute - Estado actual:', {
    user: !!user,
    loading,
    path: location.pathname
  });

  if (loading) {
    return (
      <Box 
        minH="100vh" 
        bg="gray.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.700"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  }

  if (!user) {
    console.log('PrivateRoute - Redirigiendo a auth porque no hay usuario');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log('PrivateRoute - Redirigiendo a unauthorized por falta de permisos');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('PrivateRoute - Acceso permitido');
  return children;
};

export default PrivateRoute;
