import React, { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Spinner } from '@chakra-ui/react';

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

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

  if (user) {
    return <Navigate to="/projects" state={{ from: location }} replace />;
  }

  return children;
};

export default PublicRoute; 