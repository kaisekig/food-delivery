import { Body, Controller, HttpException, HttpStatus, Put, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AllowToRoles } from "src/commons/allow.to.roles.desc";
import { RoleCheckerGuard } from "src/commons/role.checker.guard";
import { CartsService } from "../cart/carts.service";
import { Cart } from "../cart/entities/carts.entities";
import { AddOrderDto } from "./dtos/add.order.dto";
import { Order } from "./entities/orders.entity";
import { OrdersService } from "./orders.service";

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly order: OrdersService,
        private readonly cart: CartsService
    ) {}

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('user')
    @Put('create')
    async createOrder(@Body() data: AddOrderDto, @Req() req: Request): Promise<Order | HttpException> {
        const currentCart: Cart = await this.cart.getActiveCartByUserId(req.token.id);

        if (!currentCart) {
            throw new HttpException('Can\'t make an order', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return await this.order.add(currentCart.cartId, currentCart.user.userId, data);
    }
    
}