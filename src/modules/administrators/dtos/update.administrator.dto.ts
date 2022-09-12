import { AdministratorInterface } from "../interfaces/administrator.interface"

export class UpdateAdministratorDto implements AdministratorInterface {
    role: 'super' | 'moderator';
}