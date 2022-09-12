import { Cart } from "src/modules/cart/entities/carts.entities";
import { Order } from "src/modules/orders/entities/orders.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserToken } from "./users.token.entity";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn({
        name: 'user_id',
        type: 'int',
        unsigned: true
    })
    userId: number;

    @Column({
        name: 'username',
        type: 'varchar',
        length: '32',
        unique: true,
        nullable: false
    })
    username: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: '128',
        nullable: false
    })
    password: string;

    @Column({
        name: 'is_active',
        type: 'tinyint',
        default: () => '1'
    })
    isActive: number;

    @Column({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP()'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
    })
    updatedAt: Date;

    @OneToMany(() => Cart, (cart) => cart.user)
    carts: Cart[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => UserToken, (userToken) => userToken.user)
    tokens: UserToken[];
}