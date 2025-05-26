import React, { useState } from 'react';
import { Routes, Route, Navigate, useParams, Outlet } from 'react-router-dom';
import ProjectList from './components/projects/ProjectList';
import ProjectDetail from './components/projects/ProjectDetails';
import CreateProject from './components/projects/CreateProject'; 
import KanbanBoard from './components/kanban/KanbanBoard'; 
import PrivateRoute from './components/PrivateRoute'; 
import AuthPage from './pages/AuthPage'; 
import UnauthorizedPage from './pages/UnauthorizedPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { ChakraProvider, Box, Flex, extendTheme } from '@chakra-ui/react';
import ProfileUser from './components/user/ProfileUser';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Flex h="100vh" overflow="hidden">
      <Sidebar collapsed={collapsed} />
      
      <Box
        flex="1"
        ml={collapsed ? "70px" : "200px"}
        transition="margin-left 0.2s"
        overflow="auto"
      >
        <Topbar 
          collapsed={collapsed} 
          toggleCollapsed={toggleCollapsed} 
        />
        
        <Box p={4}>
          <Outlet /> 
        </Box>
      </Box>
    </Flex>
  );
}

const KanbanBoardWrapper: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  return <KanbanBoard projectId={Number(projectId)} />;
};

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      500: '#0099ff',
      600: '#0077cc',
      700: '#005599',
      900: '#003366',
    },
  },
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Inter, sans-serif',
  },
});

const App: React.FC = () => {
  console.log('App - Iniciando aplicación');

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Rutas protegidas */}
            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route path="/" element={<Navigate to="/projects" replace />} />
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/projects/new" element={<CreateProject />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/projects/:projectId/kanban" element={<KanbanBoardWrapper />} />
              <Route path="/profile" element={<ProfileUser />} />
            </Route>
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;