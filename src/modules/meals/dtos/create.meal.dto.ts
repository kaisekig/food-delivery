export class CreateMealDto {
    name: string;
    weight: number;
    spicy: number;
    categoryId: number;
    price: number;
    ingredients: {
        ingredientId: number
    }[];
}