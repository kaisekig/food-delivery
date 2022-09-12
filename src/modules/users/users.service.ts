import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInterface } from './interfaces/user.interface';
import { User } from './entities/users.entity';
import { UserModel } from './users.model';
import * as bcrypt from 'bcrypt';
import { UserToken } from './entities/users.token.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly user: Repository<User>,

        @InjectRepository(UserToken)
        private readonly userToken: Repository<UserToken>,
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

    public async addToken(userId: number, token: string, expiresAt: string): Promise<UserToken | HttpException> {
        const userToken: UserToken = new UserToken();

        const user: User = await this.user.findOneBy({
            userId: userId
        });
        if (!user) {
            throw new HttpException('Can\'t find user', HttpStatus.NOT_FOUND);
        }
        userToken.user = user;
        userToken.token = token;
        userToken.expiresAt = expiresAt;

        return await this.userToken.save(userToken);
    }

    public async getToken(token: string): Promise<UserToken> {
        return await this.userToken.findOne({
            where: {
                token: token
            }
        });
    }

    public async invalidateToken(token: string): Promise<UserToken | HttpException> {
        const userToken: UserToken =  await this.userToken.findOne({
            where: {
                token: token
            }
        });

        if (!userToken) {
            throw new HttpException('Token doesn\'t exist', HttpStatus.NOT_FOUND);
        }

        userToken.isValid = 0;

        await this.userToken.save(userToken);

        return await this.getToken(token);
    }

    public async invalidateAllUserTokens(userId: number): Promise<(UserToken | HttpException)[]> {
        const user: User = await this.user.findOne({
            where: {
                userId: userId
            }
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const userTokens: UserToken[] = await this.userToken.find({
            where: {
                user: user
            }
        });

        const results = [];

        userTokens.forEach(userToken => {
            results.push(this.invalidateToken(userToken.token));
        });

        return results;
    }
}
