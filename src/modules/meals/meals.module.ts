import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './entities/meals.entity';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { Price } from './entities/prices.entity';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { Ingredient } from '../ingredients/entities/ingredients.entity';
import { CategoriesModule } from '../categories/categories.module';
import { Image } from './entities/images.entity';
import { ImagesModule } from '../images/images.module';

@Module({
    imports: [TypeOrmModule.forFeature([
        Meal,
        Price, 
        Ingredient,
        Image
    ]),
    IngredientsModule,
    CategoriesModule,
    ImagesModule,
    ],
    providers: [MealsService],
    controllers: [MealsController],
})
export class MealsModule {}
