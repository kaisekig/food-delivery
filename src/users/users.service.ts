import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInterface } from './interfaces/user.interface';
import { User } from './users.entity';
import { UserModel } from './users.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly user: Repository<User>
    ) {}

    public async getAll(): Promise<UserModel[]> {
        const users = await this.user.find();

        const newUsers = users.map((user) => {
            return new UserModel({
                userId: user.userId,
                username: user.username,
                password: user.password,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            });
        });

        return newUsers;
    }

    public async getById(id: number): Promise<UserModel | null> {
        const user =  await this.user.findOneBy({
            userId: id
        });

        if (!user) {
            return null;
        }

        return new Promise((resolve) => {
            resolve(
                new UserModel({
                    userId: user.userId,
                    username: user.username,
                    password: user.password,
                    isActive: user.isActive,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                })
            )
        });
    }

    public async getByUsername(username:string): Promise<UserModel | null> {
        const user = await this.user.findOneBy({
            username: username
        });

        if (!user) {
            return null;
        }

        return new Promise((resolve) => {
            resolve(
                new UserModel({
                    userId: user.userId,
                    username: user.username,
                    password: user.password,
                    isActive: user.isActive,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                })
            )
        });
    }

    public async create(data: UserInterface): Promise<UserModel | HttpException> {
        const currentUser = await this.getByUsername(data.username);

        if (currentUser) {
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        
        const newUser = new User();
        newUser.username = data.username;
        newUser.password = passwordHash;

        return new Promise(async (resolve, reject) => {
            await this.user.save(newUser)
            .then(data => {
                resolve(
                    new UserModel({
                        userId: data.userId,
                        username: data.username,
                        password: data.password,
                        isActive: data.isActive,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt
                    })
                )
            })
            .catch(() => {
                return reject(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
            })
        })
    }
}
