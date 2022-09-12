import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsModule } from '../cart/carts.module';
import { Cart } from '../cart/entities/carts.entities';
import { User } from '../users/entities/users.entity';
import { Order } from './entities/orders.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
    imports: [TypeOrmModule.forFeature([
        Order,
        Cart,
        User
        ]),
        CartsModule
    ],
    providers: [OrdersService],
    controllers: [OrdersController],
    exports: [OrdersService]
})
export class OrdersModule {}
