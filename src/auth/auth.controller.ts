import { Body, ClassSerializerInterceptor, Controller, HttpException, HttpStatus, Post, Put, UseInterceptors } from '@nestjs/common';
import { AdministratorService } from 'src/administrators/administrators.service';
import { CreateAdministratorDto } from 'src/administrators/dtos/create.administrator.dto';
import * as bcrypt from 'bcrypt';
import { AdministratorModel } from 'src/administrators/administrators.model';
import { CreateUserDto } from 'src/users/dtos/create.user.dto';
import { UserModel } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { CredentialsUserDto } from 'src/users/dtos/credentials.user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly administrator: AdministratorService,
        private readonly user:          UsersService,
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('admin/register')
    public async adminRegister(@Body() data: CreateAdministratorDto): Promise<AdministratorModel | HttpException> {
        return await this.administrator.create(data);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('admin/login')
    public async adminLogin(@Body() data: CreateAdministratorDto): Promise<AdministratorModel | HttpException> {
        const admin = await this.administrator.getByUsername(data.username);

        if (!admin) {
            throw new HttpException('Administrator doesn\'t exist', HttpStatus.NOT_FOUND);
        }

        if (!(await bcrypt.compare(data.password, admin.password))) {
            throw new HttpException('Credentials doesn\'t match', HttpStatus.BAD_REQUEST);
        }

        return new Promise((resolve) => {
            resolve(admin);
        });
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('user/register')
    public async userRegister(@Body() data: CreateUserDto): Promise<UserModel | HttpException> {
        return await this.user.create(data);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('user/login')
    public async userLogin(@Body() data: CredentialsUserDto): Promise<UserModel | HttpException> {
        const user = await this.user.getByUsername(data.username);

        if (!user) {
            throw new HttpException('User doesn\'t exist', HttpStatus.NOT_FOUND);
        }

        if (!(bcrypt.compare(data.password, user.password))) {
            throw new HttpException('Credentials doesn\'t match', HttpStatus.BAD_REQUEST);
        }

        return new Promise(resolve => {
            resolve(user);
        });
    } 
}
