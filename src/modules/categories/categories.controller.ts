import { Body, Controller, Get, HttpException, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { Category } from './entities/categories.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create.category.dto';
import { UpdateCategoryDto } from './dtos/update.category.dto';
import { RoleCheckerGuard } from 'src/commons/role.checker.guard';
import { AllowToRoles } from 'src/commons/allow.to.roles.desc';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly category: CategoriesService
    ) {}
    
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin', 'user')
    @Get()
    public async findAll(): Promise<Category[]> {
        return await this.category.getAll();
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin', 'user')
    @Get(':id')
    public async findOne(@Param('id') id: number): Promise<Category | HttpException> {
        return await this.category.getById(id);
    }
    
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @Put('create')
    public async create(@Body() data: CreateCategoryDto): Promise<Category | HttpException> {
        return this.category.create(data);
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @Patch(':id/edit')
    public async update(@Param('id') id: number, @Body() data: UpdateCategoryDto): Promise<Category | HttpException> {
        return this.category.update(id, data);
    }
}
