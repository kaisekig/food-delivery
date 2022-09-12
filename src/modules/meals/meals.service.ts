import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMealDto } from './dtos/create.meal.dto';
import { Meal } from './entities/meals.entity';
import { Price } from './entities/prices.entity';
import { CategoriesService } from '../categories/categories.service';
import { IngredientsService } from '../ingredients/ingredients.service';
import { UpdateMealPriceDto } from './dtos/update.meal.price.dto';
import { EditMealDto } from './dtos/edit.meal.dto';
import { Ingredient } from '../ingredients/entities/ingredients.entity';

@Injectable()
export class MealsService {
    constructor(
        @InjectRepository(Meal)
        private readonly meal: Repository<Meal>,
        
        @InjectRepository(Price)
        private readonly price: Repository<Price>,

        private readonly category: CategoriesService,
        private readonly ingredient: IngredientsService,
    ) {}

    async getAll(): Promise<Meal[]> {
        return await this.meal.find({
            relations: [
                'category',
                'ingredients',
                'prices',
                'images'
            ]
        });
    }

    async getById(id: number): Promise<Meal> {
        return await this.meal.findOne({
            where: {
                mealId: id
            }, 
            relations: [
                'category',
                'ingredients',
                'prices',
                'images'
            ]
        });
    }

    async create(data: CreateMealDto): Promise<Meal|HttpException> {
        const newMeal: Meal = new Meal();
        newMeal.name     = data.name;
        newMeal.weight   = data.weight;
        newMeal.spicy    = data.spicy;
        newMeal.category = await this.category.getById(data.categoryId);

        if (!newMeal.category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        
        let finalIngredients = [];
        for (let ingredient of data.ingredients) {
            let currentIngredient = await this.ingredient.getById(ingredient.ingredientId);
            if (!currentIngredient) {
                throw new HttpException('Ingredient not found', HttpStatus.NOT_FOUND);
            }
            finalIngredients.push(currentIngredient);
        }

        newMeal.ingredients = finalIngredients;
        let savedMeal: Meal = await this.meal.save(newMeal);

        let newPrice: Price = new Price();
        newPrice.meals = [savedMeal];
        newPrice.amount = data.price;
        
        const savedPrice = await this.price.save(newPrice);
        if (!savedPrice) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return await this.meal.findOne({
            where: {
                mealId: savedMeal.mealId
            }, 
            relations: [
                'ingredients',
                'category',
                'prices',
                'images'
            ],
        });
    }

    async update(id: number, data: UpdateMealPriceDto): Promise<Meal | HttpException> {
        const currentMeal: Meal = await this.meal.findOne({where: {
            mealId: id
        }});

        if (!currentMeal) {
            throw new HttpException('Meal haven\'t been found', HttpStatus.NOT_FOUND);
        }

        const newPrice: Price = new Price();
        newPrice.meals = [currentMeal];
        newPrice.amount = data.price;

        const savedPrice = await this.price.save(newPrice);
        if (!savedPrice) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return await this.meal.findOne(
            {where: {
                mealId: id
            }, 
            relations: [
                'category', 
                'ingredients', 
                'prices', 
                'images'
            ]}
        );
    }

    async edit(id: number, data: EditMealDto): Promise<Meal | HttpException> {
        const currentMeal = await this.meal.findOne({
            where: {
                mealId: id
            }
        });

        if (!currentMeal) {
            throw new HttpException('Meal haven\'t been found', HttpStatus.NOT_FOUND);
        }

        currentMeal.name        = data.name;
        currentMeal.weight      = data.weight;
        currentMeal.spicy       = data.spicy;
        currentMeal.category    = await this.category.getById(data.categoryId);

        const savedMeal: Meal = await this.meal.save(currentMeal);
        if (!savedMeal) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const existingPrices: Price[] = await this.price.find({
            where: {
                meals: [savedMeal]
            }
        });

        const lastExistingPrice: Price = existingPrices[existingPrices.length - 1];
        const lastExistingPriceString: string = Number(lastExistingPrice.amount).toFixed(2).toString();
        const potentialPriceString: string    = Number(data.price).toFixed(2).toString(); 

        if (lastExistingPriceString !== potentialPriceString) {
            const newPrice: Price = new Price();
            newPrice.meals = [savedMeal];
            newPrice.amount = data.price;

            const savedPrice = await this.price.save(newPrice);
            if (!savedPrice) {
                throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        
        if (data.ingredients.length !== 0) {
            let finalIngredients = [];
            for (let ingredient of data.ingredients) {
                let currentIngredient: Ingredient = await this.ingredient.getById(ingredient.ingredientId);
                if (!currentIngredient) {
                    throw new HttpException('Ingredient not found', HttpStatus.NOT_FOUND);
                }

                finalIngredients.push(currentIngredient);
            }

            savedMeal.ingredients = finalIngredients;
        }

        const updatedMeal = await this.meal.save(savedMeal);
        if (!updatedMeal) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return await this.meal.findOne(
            {where: {
                mealId: id
            }, 
            relations: [
                'category', 
                'ingredients', 
                'prices', 
                'images'
            ]}
        );
    }
}