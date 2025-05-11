import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardBody, 
  Button, 
  GridItem,
  useColorModeValue
} from '@chakra-ui/react';
import { Project } from '@/types/project';
import { 
  ProjectCardHeader, 
  ProjectCardDescription, 
  ProjectCardTags, 
  ProjectCardStatus, 
  ProjectCardProgress 
} from './ProjectCardComponents';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardShadow = useColorModeValue('md', 'dark-lg');

  const handleViewDetails = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <GridItem 
      colSpan={{ base: 12, sm: 6, md: 4, lg: 4, xl: 3 }}
      p={3} 
    >
      <Card
        bg={cardBg}
        borderRadius="xl"
        overflow="hidden"
        border="none"
        boxShadow={cardShadow}
        transition="all 0.2s ease"
        _hover={{ boxShadow: 'md' }} 
      >
        <CardBody p={5}>
          <ProjectCardHeader project={project} />
          <ProjectCardDescription project={project} />
          <ProjectCardTags project={project} />
          <ProjectCardStatus project={project} />
          <ProjectCardProgress project={project} />
          <Button 
            colorScheme="blue"
            variant="outline"
            size="md"
            width="full"
            borderRadius="md"
            mt={4}
            onClick={() => handleViewDetails(project.id)}
          >
            Ver detalles
          </Button>
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default ProjectCard;