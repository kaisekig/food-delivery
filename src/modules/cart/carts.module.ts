import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/carts.entities';
import { CartMeal } from './entities/carts.meals.entity';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Meal } from '../meals/entities/meals.entity';
import { User } from '../users/entities/users.entity';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports:[TypeOrmModule.forFeature([
        Cart,
        CartMeal,
        Meal,
        User
    ]),
    ],
    providers: [CartsService],
    controllers: [CartsController],
    exports: [CartsService]
})
export class CartsModule {}
