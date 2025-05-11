
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Space, 
  Spin, 
  Tag, 
  Breadcrumb, 
  Modal, 
  message, 
  Progress, 
  Row, 
  Col, 
  Card,
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  TeamOutlined, 
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  FlagOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Project } from '../../types/project';
import { getProjectById, deleteProject } from '../../services/projectService';

const { Title, Paragraph } = Typography;

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        const data = await getProjectById(Number(projectId));
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        message.error('No se pudo cargar el proyecto');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleEditProject = () => {
    if (project) {
      navigate(`/projects/${project.id}/edit`);
    }
  };

  const handleDeleteProject = () => {
    Modal.confirm({
      title: '¿Estás seguro de que quieres eliminar este proyecto?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        if (!project) return;
        
        try {
          await deleteProject(project.id);
          message.success('Proyecto eliminado correctamente');
          navigate('/projects');
        } catch (error) {
          console.error('Error deleting project:', error);
          message.error('No se pudo eliminar el proyecto');
        }
      },
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return <div>No se encontró el proyecto</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in progress': return 'processing';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/dashboard">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/projects">Proyectos</Breadcrumb.Item>
        <Breadcrumb.Item>{project.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>{project.name}</Title>
            <Space>
              <Button icon={<EditOutlined />} onClick={handleEditProject}>
                Editar
              </Button>
              <Button icon={<DeleteOutlined />} danger onClick={handleDeleteProject}>
                Eliminar
              </Button>
            </Space>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Paragraph>{project.description}</Paragraph>
              <Progress 
                percent={project.progress || 0} 
                status={project.status === 'completed' ? 'success' : 'active'}
                style={{ marginBottom: 24 }}
              />
            </Col>
            <Col xs={24} lg={8}>
              <Card type="inner" title="Información del Proyecto">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Tag color={getStatusColor(project.status)}>
                      <Space>
                        <CheckCircleOutlined />
                        {project.status === 'completed' ? 'Completado' : 
                         project.status === 'in progress' ? 'En progreso' : 'Activo'}
                      </Space>
                    </Tag>
                    <Tag color={getPriorityColor(project.priority)}>
                      <Space>
                        <FlagOutlined />
                        {project.priority === 'high' ? 'Alta' :
                         project.priority === 'medium' ? 'Media' : 'Baja'}
                      </Space>
                    </Tag>
                  </div>
                  <div>
                    <CalendarOutlined /> Inicio: {new Date(project.start_date).toLocaleDateString()}
                  </div>
                  {project.end_date && (
                    <div>
                      <CalendarOutlined /> Fin: {new Date(project.end_date).toLocaleDateString()}
                    </div>
                  )}
                  <div>
                    <UserOutlined /> Creador: {project.creator?.name || 'Usuario'}
                  </div>
                  <div>
                    <TeamOutlined /> Tareas: {project.tasks?.length || 0}
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default ProjectDetail;