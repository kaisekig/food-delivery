import { Order } from "src/modules/orders/entities/orders.entity";
import { User } from "src/modules/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartMeal } from "./carts.meals.entity";

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn({
        name: 'cart_id',
        type: 'int',
        unsigned: true
    })
    cartId: number;

    @Column({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP()'
    })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.carts, {nullable: false})
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'userId'
    })
    user: User;

    @OneToMany(() => CartMeal, (cartMeal) => cartMeal.cart)
    cartMeals: CartMeal[];

    @OneToOne(() => Order, (order) => order.cart)
    order: Order
}