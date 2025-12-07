import {Role} from '@prisma/client';

export interface CurrentUser {
    id: number;
    email: string;
    name: string | null;
    role: Role;
}