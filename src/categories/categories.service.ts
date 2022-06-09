import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { CategoryInterface } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly category: Repository<Category>
    ) {}

    public async getAll(): Promise<Category[]> {
        return await this.category.find();
    }

    public async getById(id: number): Promise<Category | HttpException> {
        const category = await this.category.findOneBy({
            categoryId: id
        });

        if (!category) {
            throw new HttpException('Category doesn\'t exist', HttpStatus.NOT_FOUND);
        }

        return new Promise(resolve => {
            resolve(category);
        });
    }

    public async create(category: CategoryInterface): Promise<Category | HttpException> {
        const newCategory: Category = new Category();

        newCategory.title = category.title;
        newCategory.parentCategoryId = category.parentCategoryId;

        return new Promise(async (resolve, reject) => {
            await this.category.save(category)
            .then(data => {
                resolve(data);
            })
            .catch(() => {
                reject(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
                return;
            })
        });
    }

    public async update(id: number, category: CategoryInterface): Promise<Category | HttpException> {
        let currentCategory = await this.category.findOneBy({
            categoryId: id
        });

        if (!currentCategory) {
            throw new HttpException('Category doesn\'t exist', HttpStatus.NOT_FOUND);
        }

        currentCategory.title = category.title;

        return new Promise(async (resolve, reject) => {
            await this.category.save(currentCategory)
            .then(data => {
                resolve(data);
            })
            .catch(() => {
                reject(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
                return;
            })
        });
    }
}
