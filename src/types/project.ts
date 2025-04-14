import { Task } from './task';
import { User } from './user';

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string; 
  endDate: string;  
  status: 'active' | 'completed' | 'in progress'; 
  priority: 'low' | 'medium' | 'high';
  progress: number;
  created_by: User;
  tasks: Task[];
}
