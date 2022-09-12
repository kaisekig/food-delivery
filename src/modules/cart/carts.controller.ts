import { Body, Controller, Get, HttpException, HttpStatus, Patch, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { AddOrderDto } from '../orders/dtos/add.order.dto';
import { Order } from '../orders/entities/orders.entity';
import { OrdersService } from '../orders/orders.service';
import { CartsService } from './carts.service';
import { AddToCartDto } from './dtos/add.to.cart.dto';
import { EditCartQuantityDto } from './dtos/edit.cart.quantity.dto';
import { Cart } from './entities/carts.entities';

@Controller('carts')
export class CartsController {
    constructor(
        private readonly cart: CartsService,

        //private readonly order: OrdersService,
    ) {}

    @Get('current')
    async getCurrentCart(@Req() req: Request) {
        const userId: number = req.token.id;
        
        let cart: Cart =  await this.cart.getActiveCartByUserId(userId);
        if (!cart) {
            cart = await this.cart.createCart(userId);
        }

        return await this.cart.getById(cart.cartId);
    }

    @Put('add-to-cart')
    async addToCart(@Req() req: Request,  @Body() data: AddToCartDto): Promise<Cart> {
        const userId: number = req.token.id;
        let cart: Cart =  await this.cart.getActiveCartByUserId(userId);

        if (!cart) {
            cart = await this.cart.createCart(userId);
        }

        const currentCart: Cart =  await this.cart.getById(cart.cartId);

        return await this.cart.addToCart(currentCart.cartId, data.mealId, data.quantity);
    }

    @Patch('edit-cart')
    async editCartQuantity(@Req() req: Request, @Body() data: EditCartQuantityDto): Promise<Cart | HttpException> {
        const cart: Cart = await this.cart.getActiveCartByUserId(req.token.id);

        return await this.cart.editCartQuantity(cart.cartId, data.mealId, data.quantity);
    }

    /*
        @Put('order/create')
        async createOrder(@Body() data: AddOrderDto, @Req() req: Request): Promise<Order | HttpException> {
            const cart: Cart = await this.cart.getActiveCartByUserId(req.token.id);
            if (cart === null) {
                throw new HttpException('Can\'t make an order', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            
            return await this.order.add(cart.cartId, cart.user.userId, data);
        }
    */
}
