import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { AdministratorModel } from 'src/modules/administrators/administrators.model';
import { AdministratorsService } from 'src/modules/administrators/administrators.service';
import { CreateAdministratorDto } from 'src/modules/administrators/dtos/create.administrator.dto';
import { CredentialsAdministratorDto } from 'src/modules/administrators/dtos/login.administrator.dto';
import { UsersService } from 'src/modules/users/users.service';
import { ResponseDto } from './dtos/response.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtDto } from './dtos/jwt.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateUserDto } from 'src/modules/users/dtos/create.user.dto';
import { UserModel } from 'src/modules/users/users.model';
import { CredentialsUserDto } from 'src/modules/users/dtos/credentials.user.dto';
import { UnixTimestamp } from 'src/helpers/unix.timestamp';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshDto } from './dtos/jwt.refresh.dto';

@Injectable({scope: Scope.REQUEST})
export class AuthService {
    constructor(
        @Inject(REQUEST) 
        private readonly req: Request,
        private readonly administrator: AdministratorsService,
        private readonly user:          UsersService,
        private readonly config: ConfigService
    ) {}

    public async registerAdmin(data: CreateAdministratorDto): Promise<AdministratorModel | HttpException> {
        return await this.administrator.create(data);
    }

    public async loginAdmin(data: CredentialsAdministratorDto): Promise<ResponseDto | HttpException> {
        const admin = await this.administrator.getByUsername(data.username);

        if (!admin) {
            throw new HttpException('Administrator doesn\'t exist', HttpStatus.NOT_FOUND);
        }

        if (!(await bcrypt.compare(data.password, admin.password))) {
            throw new HttpException('Credentials doesn\'t match', HttpStatus.BAD_REQUEST);
        }

        const {...payload} = new JwtDto();

        payload.role     = 'admin';
        payload.id       = admin.administratorId;
        payload.username = admin.username;
        payload.iat      = UnixTimestamp.now();

        let exp = new Date();
        exp.setDate(exp.getDate() + 7);
        const expTimestamp = exp.getTime() / 1000;

        payload.exp = expTimestamp;
        payload.ip  = this.req.ip;
        payload.ua  = this.req.headers['user-agent'];

        let token: string = jwt.sign(payload, this.config.get<string>('JWT_SECRET'));

        return new Promise(resolve => resolve(
            new ResponseDto("administrator", admin.administratorId, admin.username, token, "", "")
        ));
    }

    public async registerUser(data: CreateUserDto): Promise<UserModel | HttpException> {
        return await this.user.create(data);
    }

    public async loginUser(data: CredentialsUserDto): Promise<ResponseDto | HttpException> {
        const user = await this.user.getByUsername(data.username);

        if (!user) {
            throw new HttpException('User doesn\'t exist', HttpStatus.NOT_FOUND);
        }

        if ((!await bcrypt.compare(data.password, user.password))) {
            throw new HttpException('Credentials doesn\'t match', HttpStatus.BAD_REQUEST);
        }

        const {...payload} = new JwtDto();
        payload.role        = 'user';
        payload.id          = user.userId;
        payload.username    = user.username;
        payload.iat         = UnixTimestamp.now();
        payload.exp         = UnixTimestamp.futureMinutes(30);
        payload.ip          = this.req.ip;
        payload.ua          = this.req.headers['user-agent'];

        const token: string = jwt.sign(payload, this.config.get<string>('JWT_SECRET'));

        const {...payloadRefresh}    = new JwtRefreshDto();
        payloadRefresh.role     = payload.role;
        payloadRefresh.id       = payload.id;
        payloadRefresh.username = payload.username;
        payloadRefresh.iat      = UnixTimestamp.now();
        payloadRefresh.exp      = UnixTimestamp.futureDays(30);
        payloadRefresh.ip       = payload.ip;
        payloadRefresh.ua       = payload.ua;

        const refreshToken: string = jwt.sign(payloadRefresh, this.config.get<string>('JWT_SECRET'));
    
        await this.user.addToken(
            user.userId, 
            refreshToken, 
            UnixTimestamp.databaseDateFormat(UnixTimestamp.isoDate(payloadRefresh.exp))
        );

        return new Promise(resolve => resolve(
            new ResponseDto("user", user.userId, user.username, token, refreshToken, UnixTimestamp.isoDate(payloadRefresh.exp))
        ));
    }
}
