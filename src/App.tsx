import React, { useState } from 'react';
import { Routes, Route, Navigate, useParams, Outlet } from 'react-router-dom';
import ProjectList from './components/projects/ProjectList';
import ProjectDetail from './components/projects/ProjectDetails';
import CreateProject from './components/CreateProject'; 
import KanbanBoard from './components/KanbanBoard'; 
import PrivateRoute from './components/PrivateRoute'; 
import AuthPage from './pages/AuthPage'; 
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { Box, Flex } from '@chakra-ui/react';

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
          <Outlet /> {/* Aquí se renderizarán las rutas hijas */}
        </Box>
      </Box>
    </Flex>
  );
}

const KanbanBoardWrapper: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  return <KanbanBoard projectId={Number(projectId)} />;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Rutas protegidas */}
      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/projects" replace />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/new" element={<CreateProject />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        <Route path="projects/:projectId/kanban" element={<KanbanBoardWrapper />} />
        <Route path="profile" element={<div>Página de Perfil</div>} /> {/* Añadir ruta de perfil */}
      </Route>
    </Routes>
  );
};

export default App;