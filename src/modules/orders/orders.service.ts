import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../cart/entities/carts.entities';
import { User } from '../users/entities/users.entity';
import { AddOrderDto } from './dtos/add.order.dto';
import { Order } from './entities/orders.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly order: Repository<Order>,

        @InjectRepository(Cart)
        private readonly cart: Repository<Cart>,

        @InjectRepository(User)
        private readonly user: Repository<User>,
    ) {}

    async add(cartId: number, userId: number, data: AddOrderDto): Promise<Order | HttpException> {
        const cart = await this.cart.findOne({
            where: {
                cartId: cartId
            },
            relations: [
                'cartMeals',
                'cartMeals.meal',
                'cartMeals.meal.prices'
            ]
        });

        if (!cart) {
            return new HttpException('Cart not found', HttpStatus.NOT_FOUND);
        }

        if (!cart.cartMeals || cart.cartMeals.length === 0)  {
            return new HttpException('Cart is empty', HttpStatus.EXPECTATION_FAILED);
        }
        
        const order: Order = await this.order.findOne({
            where: {
                cart: {
                    cartId: cartId
                }
            }
        });

        if (order) {
            return new HttpException('Order has already been made', HttpStatus.EXPECTATION_FAILED);
        }

        const newOrder: Order = new Order();
        newOrder.cart = await this.cart.findOne({
            where: {
                cartId: cartId
            }
        });
        newOrder.user = await this.user.findOne({
            where: {
                userId: userId
            }
        });

        const orderNumber:string = Math.random().toFixed(16);

        newOrder.number = orderNumber.substring(2);
        
        newOrder.address = data.address;

        const savedOrder: Order = await this.order.save(newOrder);

        return await this.order.findOne({
            where: {
                orderId: savedOrder.orderId
            },
            relations: [
                'cart',
                'cart.cartMeals',
                'cart.cartMeals.meal',
                'user'
            ]
        });
    }
}
