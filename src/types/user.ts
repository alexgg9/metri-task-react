export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    password: string;
    phone: string;
    address: string;
    birthdate: string;
    role: 'admin' | 'manager' | 'member';

}