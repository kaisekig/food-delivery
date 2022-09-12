import { Body, Controller, Get, HttpException, Param, Patch, Put, UseGuards } from "@nestjs/common";
import { AllowToRoles } from "src/commons/allow.to.roles.desc";
import { RoleCheckerGuard } from "src/commons/role.checker.guard";
import { AddIngredientDto } from "./dtos/add.ingredient.dto";
import { EditIngredientDto } from "./dtos/edit.ingredient.dto";
import { Ingredient } from "./entities/ingredients.entity";
import { IngredientsService } from "./ingredients.service";

@Controller('ingredients')
export class IngredientsController {
    constructor(
        private readonly ingredient: IngredientsService
    ) {}

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @Get()
    async getAll(): Promise<Ingredient[] | HttpException> {
        return await this.ingredient.getAll();
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @Get(':id')
    async getById(@Param('id') id: number): Promise<Ingredient | HttpException> {
        return await this.ingredient.getById(id);
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @Put('create')
    async create(@Body() data:AddIngredientDto): Promise<Ingredient| HttpException> {
        return await this.ingredient.create(data);
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @Patch(':id/edit')
    async edit(@Param('id') id: number, @Body() data: EditIngredientDto): Promise<Ingredient> {
        return await this.ingredient.edit(id, data);
    }
}