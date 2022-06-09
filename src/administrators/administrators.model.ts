import { Exclude } from "class-transformer";

export class AdministratorModel {
    administratorId: number;
    username: string;
    isActive: number;
    role: 'super' | 'moderator';
    createdAt: Date;
    updatedAt: Date;

    @Exclude()
    password: string;

    constructor(partial: Partial<AdministratorModel>) {
        Object.assign(this, partial);
    }
}