import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, Col, Row, Button, Tag, Modal } from 'antd';
import { getTasks, updateTask, deleteTask } from '../services/taskService'; 
import { Task } from '../types/task';

const KanbanBoard: React.FC<{ projectId: number }> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  interface Column {
    name: string;
    tasks: Task[];
  }
  
  const [columns, setColumns] = useState<Record<string, Column>>({
    todo: { name: 'Por hacer', tasks: [] },
    'in-progress': { name: 'En progreso', tasks: [] },
    done: { name: 'Hecho', tasks: [] },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Cargar tareas al montar el componente
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const tasksData = await getTasks();
        const filteredTasks = tasksData.filter((task) => task.project.id === projectId);

        const updatedColumns = { ...columns };
        filteredTasks.forEach((task) => {
          updatedColumns[task.status].tasks.push(task);
        });
        setColumns(updatedColumns);
        setTasks(filteredTasks);
      } catch (error) {
        console.error('Error al obtener las tareas', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  // Manejar el evento de arrastre
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
    destColumn.tasks.splice(destination.index, 0, movedTask);

    movedTask.status = destination.droppableId as "pending" | "in_rogress" | "completed";

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn },
      [destination.droppableId]: { ...destColumn },
    });


    try {
      await updateTask(movedTask.id, { status: movedTask.status });
    } catch (error) {
      console.error('Error al actualizar la tarea', error);
    }
  };


  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error al eliminar la tarea', error);
    }
  };


  const showTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };


  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Row gutter={16}>
            {Object.entries(columns).map(([columnId, column]) => (
              <Col span={8} key={columnId}>
                <h3>{column.name}</h3>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: '#f0f2f5',
                        padding: 8,
                        minHeight: 200,
                        borderRadius: '8px',
                      }}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                marginBottom: 8,
                                cursor: 'pointer',
                                border: '1px solid #ddd',
                              }}
                              onClick={() => showTaskDetails(task)}
                            >
                              <h4>{task.name}</h4>
                              <Tag color="blue">{task.status}</Tag>
                              <Button
                                danger
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTask(task.id);
                                }}
                                size="small"
                              >
                                Eliminar
                              </Button>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Col>
            ))}
          </Row>
        </DragDropContext>
      )}

      {/* Modal de detalle de tarea */}
      <Modal
        title="Detalles de la Tarea"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        {selectedTask && (
          <div>
            <h4>{selectedTask.name}</h4>
            <p>{selectedTask.description}</p>
            <p><strong>Proyecto: </strong>{selectedTask.project.name}</p>
            <p><strong>Creado por: </strong>{selectedTask.created_by.name}</p>
            <p><strong>Fecha Limite: </strong>{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KanbanBoard;
