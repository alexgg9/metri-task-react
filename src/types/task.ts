import { User } from "./user";
import { Project } from "./project"; 

export interface Task {
    id: number;
    name: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    project_id: number;
    assignee?: {
        id: number;
        name: string;
    };
    tags?: string[];
    created_at?: string;
    updated_at?: string;
}