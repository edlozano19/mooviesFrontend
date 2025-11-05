export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: UserRole;
}

export interface UserDisplay {
    id: number;
    fullName: string;
    username: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    joinedDate: string;
}

export interface GetUsersResponse {
    users: User[];
    totalCount: number;
    activeCount: number;
}

export interface GetUserResponse {
    user: User;
}