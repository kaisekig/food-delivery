import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Administrator } from "./entities/administrators.entity";
import { CreateAdministratorDto } from "./dtos/create.administrator.dto";
import { AdministratorInterface } from "./interfaces/administrator.interface";
import * as bcrypt from "bcrypt";
import { AdministratorModel } from "./administrators.model";

@Injectable()
export class AdministratorsService {
    constructor(
        @InjectRepository(Administrator)
        private readonly administrator: Repository<Administrator>
    ) {}

    public async getAll(): Promise<AdministratorModel[]> {
        const admins =  await this.administrator.find();

        const newAdmins = admins.map((admin) => {
            return new AdministratorModel({
                administratorId: admin.administratorId,
                username:        admin.username,
                isActive:        admin.isActive,
                role:            admin.role,
                createdAt:       admin.createdAt,
                updatedAt:       admin.updatedAt,
            });
        });

        return newAdmins;
    }

    public getById(id: number): Promise<AdministratorModel | HttpException> {
        return new Promise(async (resolve, reject) => {
            const admin = await this.administrator.findOneBy({
                administratorId: id
            });

            if (!admin) {
                reject(new HttpException('Administrator doesn\'t exist!', HttpStatus.NOT_FOUND));
                return;
            }

            resolve(
                new AdministratorModel({
                    administratorId: admin.administratorId,
                    username:        admin.username,
                    isActive:        admin.isActive,
                    role:            admin.role,
                    createdAt:       admin.createdAt,
                    updatedAt:       admin.updatedAt,
                })
            );
        })
    }

    public async getByUsername(username: string): Promise<AdministratorModel | null> {
        const admin =  await this.administrator.findOneBy({
            username: username
        });

        if (!admin) {
            return null;
        }

        return new AdministratorModel({
            administratorId: admin.administratorId,
            username: admin.username,
            password: admin.password,
            isActive: admin.isActive,
            role: admin.role,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
        });
    }

    public async create(createAdministratorDto: CreateAdministratorDto): Promise<AdministratorModel | HttpException> {
        const admin = await this.getByUsername(createAdministratorDto.username);

        return new Promise(async (resolve, reject) => {
            if(admin) {
                reject(new HttpException('Administrator already exists', HttpStatus.CONFLICT));
                return;
            };

            const passwordHash = await bcrypt.hash(createAdministratorDto.password, 10);

            const newAdmin: Administrator = new Administrator();
            newAdmin.username = createAdministratorDto.username;
            newAdmin.password = passwordHash;

            await this.administrator.save(newAdmin)
            .then(data => {
                resolve(
                    new AdministratorModel({
                        administratorId: data.administratorId,
                        username:        data.username,
                        password:        data.password,
                        isActive:        data.isActive,
                        role:            data.role,
                        createdAt:       data.createdAt,
                        updatedAt:       data.updatedAt,
                    })
                );
            })
            .catch(() => {
                reject(new HttpException("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR))
            })
        });
    }

    public async edit(id: number, administratorInterface: AdministratorInterface): Promise<AdministratorModel | HttpException> {
        const admin = await this.administrator.findOneBy({
            administratorId: id
        });

        if (!admin) {
            throw new HttpException('Administrator doesn\'t exist', HttpStatus.NOT_FOUND);
        }

        const newPasswordHash = await bcrypt.hash(administratorInterface.password, 10);
        admin.password = newPasswordHash;

        const savedAdmin = await this.administrator.save(admin);

        return new Promise((resolve) => {
            if (!savedAdmin) {
                throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            resolve(
                new AdministratorModel({
                    administratorId: savedAdmin.administratorId,
                    username:        savedAdmin.username,
                    password:        savedAdmin.password,
                    isActive:        savedAdmin.isActive,
                    role:            savedAdmin.role,
                    createdAt:       savedAdmin.createdAt,
                    updatedAt:       savedAdmin.updatedAt,
                })
            )
        })
    }

    public async validate(id:number, administratorInterface: AdministratorInterface): Promise<AdministratorModel | HttpException> {
        const admin = await this.administrator.findOneBy({
            administratorId: id
        });

        if (!admin) {
            throw new HttpException('Administrator doesn\'t exist', HttpStatus.NOT_FOUND);
        }

        admin.isActive = administratorInterface.isActive;
        const savedAdmin = await this.administrator.save(admin);

        if (!savedAdmin) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new Promise((resolve) => {
            resolve(new AdministratorModel({ 
                administratorId:    savedAdmin.administratorId,
                username:           savedAdmin.username,
                password:           savedAdmin.password,
                isActive:           savedAdmin.isActive,
                role:               savedAdmin.role,
                createdAt:          savedAdmin.createdAt,
                updatedAt:          savedAdmin.updatedAt,
            }))
        });

        
    }

    public async update(id: number, administratorInterface: AdministratorInterface): Promise<AdministratorModel | HttpException> {
        const admin = await this.administrator.findOneBy({
            administratorId: id
        });

        if (!admin) {
            throw new HttpException('Administrator doesn\'t exist', HttpStatus.NOT_FOUND);
        }
        admin.role = administratorInterface.role;
        const savedAdmin = await this.administrator.save(admin);

        if (!savedAdmin) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new Promise((resolve) => {
            resolve(new AdministratorModel({
                administratorId: savedAdmin.administratorId,
                username:           savedAdmin.username,
                password:           savedAdmin.password,
                isActive:           savedAdmin.isActive,
                role:               savedAdmin.role,
                createdAt:          savedAdmin.createdAt,
                updatedAt:          savedAdmin.updatedAt,
            }))
        });
    }
}