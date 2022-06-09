import { UserInterface } from "../interfaces/user.interface";

export class CreateUserDto implements UserInterface {
    username: string;
    password: string;
}