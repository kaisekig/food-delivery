import { Meal } from "src/modules/meals/entities/meals.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./carts.entities";

@Entity('cart_meal')
export class CartMeal {
    @PrimaryGeneratedColumn({
        name: 'cart_meal_id',
        type: 'int',
        unsigned: true
    })
    cartMealId: number;

    @Column({
        name: 'quantity',
        type: 'int',
        unsigned: true,
        nullable: false
    })
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.cartMeals, {nullable: false})
    @JoinColumn({
        name: 'cart_id',
        referencedColumnName: 'cartId'
    })
    cart: Cart;

    @ManyToOne(() => Meal, (meal) => meal.cartMeals, {nullable: false})
    @JoinColumn({
        name: 'meal_id',
        referencedColumnName: 'mealId'
    })
    meal: Meal;


}