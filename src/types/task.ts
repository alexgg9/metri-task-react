import { User } from './user';
import { Project } from "./project"; 

export interface Task {
    id: number;
    name: string;
    description: string;
    status: string;
    priority: 'low' | 'medium' | 'high';
    due_date: string;
    project_id: number;
    assigned_to: User;
    created_by: User;
    created_at: string;
    updated_at: string;
}