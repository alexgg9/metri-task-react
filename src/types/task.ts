import { User } from "./user";


export interface Task {
    id: number;
    title: string;
    description: string;
    due_date: string | null;
    completed_at: string | null;
    status: 'pending' | 'in progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    created_at: string | null;
    updated_at: string | null;
    project_id: number;
    user_id: number | null;
    assigned_to?: User;
}