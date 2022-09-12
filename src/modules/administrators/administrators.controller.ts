import { Body, ClassSerializerInterceptor, Controller, Get, HttpException, Param, Patch, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { AllowToRoles } from 'src/commons/allow.to.roles.desc';
import { RoleCheckerGuard } from 'src/commons/role.checker.guard';
import { AdministratorModel } from './administrators.model';
import { AdministratorsService } from './administrators.service';
import { CreateAdministratorDto } from './dtos/create.administrator.dto';
import { EditAdministratorDto } from './dtos/edit.administrator.dto';
import { UpdateAdministratorDto } from './dtos/update.administrator.dto';
import { ValidateAdministratorDto } from './dtos/validate.administrator.dto';

@Controller('administrators')
export class AdministratorsController {
    constructor(
        private readonly administrator: AdministratorsService
    ) {}

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    public async findAll(): Promise<AdministratorModel[]> {
        return await this.administrator.getAll();
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    public async findOne(@Param('id') id: number): Promise<AdministratorModel | HttpException> {
        return await this.administrator.getById(id);
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @UseInterceptors(ClassSerializerInterceptor)
    @Put('add')
    public async add(@Body() data: CreateAdministratorDto): Promise<AdministratorModel | HttpException> {
        return await this.administrator.create(data);
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch(':id/edit')
    public async edit(@Param('id') id: number, @Body() data: EditAdministratorDto): Promise<AdministratorModel | HttpException> {
        return await this.administrator.edit(id, data);
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch(':id/validate')
    public async validate(@Param('id') id: number, @Body() data: ValidateAdministratorDto): Promise<AdministratorModel | HttpException> {
        return await this.administrator.validate(id, data);
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch(':id/update')
    public async update(@Param('id') id: number, @Body() data: UpdateAdministratorDto): Promise<AdministratorModel | HttpException> {
        return await this.administrator.update(id, data);
    }
}