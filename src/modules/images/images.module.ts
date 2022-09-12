import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/modules/meals/entities/images.entity';
import { Meal } from '../meals/entities/meals.entity';
import { ImagesService } from './images.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Image,
    Meal
  ])],
  providers: [ImagesService],
  exports: [ImagesService]
})
export class ImagesModule {}
