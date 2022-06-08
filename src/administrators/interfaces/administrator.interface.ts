export interface AdministratorInterface {
    administratorId?: number; 
    username?: string;
    password?: string;
    isActive?: number;
    role?: 'super' | 'moderator';
    createdAt?: Date
    updatedAt?: Date
}