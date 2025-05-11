import { User } from "./user";
import { Project } from "./project"; 

export interface Task {
    id: number;
    name: string;
    description: string;
    dueDate: string; 
    comments: string; 
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    assigned_to: User;
    created_by: User;        
    project: Project; 
}