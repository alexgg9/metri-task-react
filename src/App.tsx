import React from 'react';
import { Routes, Route, Navigate, useParams, Outlet } from 'react-router-dom';
import ProjectList from './components/projects/ProjectList';
import ProjectDetail from './components/projects/ProjectDetails';
import CreateProject from './components/projects/CreateProject'; 
import KanbanBoard from './components/kanban/KanbanBoard'; 
import PrivateRoute from './components/PrivateRoute'; 
import AuthPage from './pages/AuthPage'; 
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProfilePage from './components/user/ProfileUser';
import LandingPage from './pages/Landing';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import MainLayout from './components/MainLayout';

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
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Rutas protegidas */}
            <Route element={<PrivateRoute><MainLayout><Outlet /></MainLayout></PrivateRoute>}>
              <Route path="/dashboard" element={<Navigate to="/projects" replace />} />
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/projects/new" element={<CreateProject />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/projects/:projectId/kanban" element={<KanbanBoardWrapper />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;