
export type ProjectStatus = 'pending' | 'in progress' | 'completed';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  creator?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  users?: Array<{
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  }>;
  tasks?: Array<{
    id: number;
    title: string;
    status: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

export const PROJECT_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member'
} as const;

export type ProjectRole = typeof PROJECT_ROLES[keyof typeof PROJECT_ROLES];