import { Exclude } from "class-transformer";
import { User } from "./entities/users.entity";

export class UserModel {
    userId: number;
    username: string;
    isActive: string;
    createdAt: Date;
    updatedAt: Date;

    @Exclude()
    password: string;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial)
    }
}