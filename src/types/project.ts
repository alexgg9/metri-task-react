import { Task } from './task';
import { User } from './user';

export interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'in progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
  creator?: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };
  tasks?: Task[];
  users?: User[];
}

export const PROJECT_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member'
} as const;

export type ProjectRole = typeof PROJECT_ROLES[keyof typeof PROJECT_ROLES];