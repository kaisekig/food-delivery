import { AdministratorInterface } from "../interfaces/administrator.interface";

export class CreateAdministratorDto implements AdministratorInterface {
    username: string;
    password: string;
}