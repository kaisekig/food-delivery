import { CartMeal } from "src/modules/cart/entities/carts.meals.entity";
import { Category } from "src/modules/categories/entities/categories.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./images.entity";
import { Ingredient } from "../../ingredients/entities/ingredients.entity";
import { Price } from "./prices.entity";

@Entity('meal')
export class Meal {
    @PrimaryGeneratedColumn({
        name: 'meal_id',
        type: 'int',
        unsigned: true
    })
    mealId: number;

    @Column({
        name: 'name',
        type: 'varchar',
        length: '128',
        nullable: false,
        unique: true
    })
    name: string;

    @Column({
        name: 'weight',
        type: 'int',
        unsigned: true
    })
    weight: number;

    @Column({
        name: 'spicy',
        type: 'tinyint',
        unsigned: true
    })
    spicy: number;

    @ManyToMany(() => Ingredient, (ingredient) => ingredient.meals)
    @JoinTable({
        name: 'meal_ingredient',
        joinColumn: {
            name: 'meal_id',
            referencedColumnName: 'mealId',
        }, 
        inverseJoinColumn: {
            name: 'ingredient_id',
            referencedColumnName: 'ingredientId'
        }
    })
    ingredients: Ingredient[];

    @ManyToOne(() => Category, (category) => category.meals, {nullable: false})
    @JoinColumn({
        name: 'category_id',
        referencedColumnName: 'categoryId'
    })
    category: Category;

    @ManyToMany(() => Price, (price) => price.meals)
    @JoinTable({
        name: 'meal_price',
        joinColumn:({
            name: 'meal_id',
            referencedColumnName: 'mealId'
        }),
        inverseJoinColumn:({
            name: 'price_id',
            referencedColumnName: 'priceId'
        })
    })
    prices: Price[];

    @OneToMany(() => CartMeal, (cartMeal) => cartMeal.cart)
    cartMeals: CartMeal[];

    @OneToMany(() => Image, (image) => image.meal)
    images: Image[];
}
