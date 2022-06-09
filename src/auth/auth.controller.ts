import { Body, ClassSerializerInterceptor, Controller, HttpException, HttpStatus, Post, Put, UseInterceptors } from '@nestjs/common';
import { AdministratorService } from 'src/administrators/administrators.service';
import { CreateAdministratorDto } from 'src/administrators/dtos/create.administrator.dto';
import * as bcrypt from 'bcrypt';
import { AdministratorModel } from 'src/administrators/administrators.model';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly administrator: AdministratorService
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('admin/register')
    public async register(@Body() data: CreateAdministratorDto): Promise<AdministratorModel | HttpException> {
        return await this.administrator.create(data);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('admin/login')
    public async login(@Body() data: CreateAdministratorDto): Promise<AdministratorModel | HttpException> {
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
}
