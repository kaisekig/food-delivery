import { type } from "os";
import { Cart } from "src/modules/cart/entities/carts.entities";
import { User } from "src/modules/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export type Status = 'pending' | 'accepted'| 'rejected' | 'shipped' | 'delivered';

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn({
        name: 'order_id',
        type: 'int',
        unsigned: true
    })
    orderId: number;

    @Column({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP()'
    })
    createdAt: Date;

    @Column({
        name: 'address',
        type: 'varchar',
        length: 255,
    })
    address: string;

    @Column({
        name: 'number',
        type: 'varchar',
        length: 16
    })
    number: string;
    
    @Column({
        name: 'status',
        type: 'enum',
        enum: ['pending', 'accepted', 'rejected', 'shipped', 'delivered'],
        default: 'pending'
        
    })
    status: Status;

    @ManyToOne(()=> User, (user) => user.orders, {nullable: false})
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'userId'
    })
    user: User;

    @OneToOne(() => Cart, {nullable: false})
    @JoinColumn({
        name: 'cart_id',
        referencedColumnName: 'cartId',  
    })
    cart: Cart
}