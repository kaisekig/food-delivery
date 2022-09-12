import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddIngredientDto } from "./dtos/add.ingredient.dto";
import { EditIngredientDto } from "./dtos/edit.ingredient.dto";
import { Ingredient } from "./entities/ingredients.entity";

@Injectable()
export class IngredientsService {
    constructor(
        @InjectRepository(Ingredient)
        private readonly ingredient: Repository<Ingredient>,
    ) {}

    async getAll(): Promise<Ingredient[] | HttpException> {
        return await this.ingredient.find();
    }

    async getById(id: number): Promise<Ingredient> {
        return await this.ingredient.findOne({where: {
            ingredientId: id
        }});
    }

    async create(data: AddIngredientDto): Promise<Ingredient | HttpException> {
        const newIngredient: Ingredient = new Ingredient();

        newIngredient.name    = data.name;
        newIngredient.spicy   = data.spicy;
        newIngredient.alergen = data.alergen;

        return await this.ingredient.save(newIngredient);
    }

    async edit(id: number, data: EditIngredientDto): Promise<Ingredient> {
        let ingredient: Ingredient = await this.ingredient.findOne({where: {
            ingredientId: id
        }});

        ingredient.name    = data.name;
        ingredient.spicy   = data.spicy;
        ingredient.alergen = data.alegren;

        await this.ingredient.update(id, ingredient);

        return ingredient;
    }
}