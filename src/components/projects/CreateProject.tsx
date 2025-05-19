import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../services/projectService';

const { Title } = Typography;
const { TextArea } = Input;

const CreateProject: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const newProject = {
        title: values.title,
        description: values.description,
        ownerId: '', 
      };
      
      const createdProject = await createProject(newProject);
      message.success('Proyecto creado correctamente');
      navigate(`/projects/${createdProject.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      message.error('No se pudo crear el proyecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Title level={2}>Crear Nuevo Proyecto</Title>
      
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Título del Proyecto"
            rules={[{ required: true, message: 'Por favor ingresa un título para el proyecto' }]}
          >
            <Input placeholder="Ej: Sistema de Gestión de Inventario" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: 'Por favor ingresa una descripción' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Describe el propósito y objetivos de este proyecto" 
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Crear Proyecto
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/projects')}>
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateProject;