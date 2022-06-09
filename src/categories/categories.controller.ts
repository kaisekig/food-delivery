import { Body, Controller, Get, HttpException, Param, Patch, Post } from '@nestjs/common';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create.category.dto';
import { UpdateCategoryDto } from './dtos/update.category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly category: CategoriesService
    ) {}
    
    @Get()
    public async findAll(): Promise<Category[]> {
        return await this.category.getAll();
    }

    @Get(':id')
    public async findOne(@Param('id') id: number): Promise<Category | HttpException> {
        return await this.category.getById(id);
    }

    @Post('create')
    public async create(@Body() data: CreateCategoryDto): Promise<Category | HttpException> {
        return this.category.create(data);
    }

    @Patch(':id/edit')
    public async update(@Param('id') id: number, @Body() data: UpdateCategoryDto): Promise<Category | HttpException> {
        return this.category.update(id, data);
    }
    
}
