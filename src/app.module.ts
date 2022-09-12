import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from './modules/administrators/entities/administrators.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { Category } from './modules/categories/entities/categories.entity';
import { CategoriesModule } from './modules/categories/categories.module';
import { User } from './modules/users/entities/users.entity';
import { UsersModule } from './modules/users/users.module';
import { MealsModule } from './modules/meals/meals.module';
import { Meal } from './modules/meals/entities/meals.entity';
import { Ingredient } from './modules/ingredients/entities/ingredients.entity';
import { Price } from './modules/meals/entities/prices.entity';
import { CartsModule } from './modules/cart/carts.module';
import { Cart } from './modules/cart/entities/carts.entities';
import { CartMeal } from './modules/cart/entities/carts.meals.entity';
import { OrdersModule } from './modules/orders/orders.module';
import { Order } from './modules/orders/entities/orders.entity';
import { AdministratorsModule } from './modules/administrators/administrators.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { Image } from './modules/meals/entities/images.entity';
import { AdministratorsController } from './modules/administrators/administrators.controller';
import { CategoriesController } from './modules/categories/categories.controller';
import { IngredientsModule } from './modules/ingredients/ingredients.module';
import { ImagesModule } from './modules/images/images.module';
import { MealsController } from './modules/meals/meals.controller';
import { IngredientsController } from './modules/ingredients/ingredients.controller';
import { UsersController } from './modules/users/users.controller';
import { CartsController } from './modules/cart/carts.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersController } from './modules/orders/orders.controller';
import { UserToken } from './modules/users/entities/users.token.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
        type: 'mysql',
        port:3306,
        host: configService.get<string>('DB_HOST'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          Administrator,
          User,
          Category,
          Meal,
          Ingredient,
          Price,
          Cart,
          CartMeal,
          Order,
          Image,
          UserToken,
        ],
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    AdministratorsModule,
    UsersModule,
    CategoriesModule,
    MealsModule,
    IngredientsModule,
    CartsModule,
    OrdersModule,
    ImagesModule,
  ],
  controllers: [
    AppController,
    UsersController
  ],
  providers: [
    AppService,
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
            .exclude('auth/*')
            .forRoutes(
              AdministratorsController,
              CategoriesController,
              MealsController,
              IngredientsController,
              CartsController,
              OrdersController
            );
  }

}
