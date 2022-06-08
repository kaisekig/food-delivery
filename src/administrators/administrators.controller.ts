import { Body, ClassSerializerInterceptor, Controller, Get, HttpException, Param, Patch, Put, UseInterceptors } from '@nestjs/common';
import { AdministratorModel } from './administrators.model';
import { AdministratorService } from './administrators.service';
import { CreateAdministratorDto } from './dtos/create.administrator.dto';
import { EditAdministratorDto } from './dtos/edit.administrator.dto';
import { UpdateAdministratorDto } from './dtos/update.administrator.dto';
import { ValidateAdministratorDto } from './dtos/validate.administrator.dto';

@Controller('administrators')
export class AdministratorsController {
    constructor(
        private readonly administrator: AdministratorService
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    public async findAll(): Promise<AdministratorModel[]> {
        return await this.administrator.getAll();
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    public async findOne(@Param('id') id: number): Promise<AdministratorModel | HttpException> {
        return await this.administrator.getById(id);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Put('add')
    public async add(@Body() data: CreateAdministratorDto): Promise<AdministratorModel | HttpException> {
        return await this.administrator.create(data);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Patch(':id/edit')
    public async edit(@Param('id') id: number, @Body() data: EditAdministratorDto): Promise<AdministratorModel | HttpException> {
        return await this.administrator.edit(id, data);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Patch(':id/validate')
    public async validate(@Param('id') id: number, @Body() data: ValidateAdministratorDto): Promise<AdministratorModel | HttpException> {
        return await this.administrator.validate(id, data);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Patch(':id/update')
    public async update(@Param('id') id: number, @Body() data: UpdateAdministratorDto): Promise<AdministratorModel | HttpException> {
        return await this.administrator.update(id, data);
    }
}