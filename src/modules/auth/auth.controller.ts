import { Body, ClassSerializerInterceptor, Controller, HttpException, HttpStatus, Post, Put, Req, UseInterceptors } from '@nestjs/common';
import { CreateAdministratorDto } from 'src/modules/administrators/dtos/create.administrator.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AdministratorModel } from 'src/modules/administrators/administrators.model';
import { CreateUserDto } from 'src/modules/users/dtos/create.user.dto';
import { UserModel } from 'src/modules/users/users.model';
import { UsersService } from 'src/modules/users/users.service';
import { CredentialsUserDto } from 'src/modules/users/dtos/credentials.user.dto';
import { AuthService } from './auth.service';
import { ResponseDto } from './dtos/response.dto';
import { Request } from 'express';
import { UserRefreshTokenDto } from './dtos/user.refresh.token.dto';
import { JwtRefreshDto } from './dtos/jwt.refresh.dto';
import { ConfigService } from '@nestjs/config';
import { JwtDto } from './dtos/jwt.dto';
import { UnixTimestamp } from 'src/helpers/unix.timestamp';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly auth: AuthService,
        private readonly user: UsersService,
        private readonly config: ConfigService,
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('admin/register')
    public async adminRegister(@Body() data: CreateAdministratorDto): Promise<AdministratorModel | HttpException> {
        return await this.auth.registerAdmin(data);
    }

    @Post('admin/login')
    public async adminLogin(@Body() data: CreateAdministratorDto): Promise<ResponseDto | HttpException> {
        return await this.auth.loginAdmin(data);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Put('user/register')
    public async userRegister(@Body() data: CreateUserDto): Promise<UserModel | HttpException> {
        return await this.auth.registerUser(data);
    }

    @Put('user/login')
    public async userLogin(@Body() data: CredentialsUserDto): Promise<ResponseDto | HttpException> {
        return await this.auth.loginUser(data);
    }
    
    @Post('user/refresh')
    public async userRefreshToken(@Req() req: Request, @Body() data: UserRefreshTokenDto): Promise<ResponseDto | HttpException> {
        const userToken = await this.user.getToken(data.token);

        if (!userToken) {
            throw new HttpException('No such refresh token', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (userToken.isValid === 0) {
            throw new HttpException('Token invalid', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const now = new Date();
        const expDate = new Date(userToken.expiresAt);

        if (now.getTime() >= expDate.getTime()) {
            throw new HttpException('Token expired', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        let payloadRefresh: JwtRefreshDto;
        try {
            payloadRefresh = jwt.verify(data.token, this.config.get<string>('JWT_SECRET'));
        } catch (err) {
            throw new HttpException('Bad token', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!payloadRefresh) {
            throw new HttpException('Bad token', HttpStatus.UNAUTHORIZED);
        }

        if (payloadRefresh.ip !== req.ip) { 
            throw new HttpException('Bad ip address', HttpStatus.UNAUTHORIZED);
        }

        if (payloadRefresh.ua !== req.headers["user-agent"]) {
            throw new HttpException('Bad user-agent', HttpStatus.UNAUTHORIZED);
        }

        const {...payload} = new JwtDto();

        payload.role     = payloadRefresh.role;
        payload.id       = payloadRefresh.id;
        payload.username = payloadRefresh.username;
        payload.iat      = UnixTimestamp.now();
        payload.exp      = UnixTimestamp.futureMinutes(5);
        payload.ip       = payloadRefresh.ip;
        payload.ua       = payloadRefresh.ua;

        let token: string = jwt.sign(payload, this.config.get<string>('JWT_SECRET'));
        
        return new ResponseDto(payloadRefresh.role, payloadRefresh.id, payloadRefresh.username, token, data.token, UnixTimestamp.isoDate(payloadRefresh.exp));
    }
}
