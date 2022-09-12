import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/modules/meals/entities/images.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Meal } from '../meals/entities/meals.entity';
import { CreateImageDto } from './dtos/create.image.dto';

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image)
        private readonly image: Repository<Image>,
        
        @InjectRepository(Meal)
        private readonly meal: Repository<Meal>
    ) {}

    async create(id: number, path: string): Promise<Image | HttpException> {
        const newImage: Image = new Image();
        newImage.meal = await this.meal.findOne({where: {
            mealId: id
        }});

        newImage.path = path;

        const savedImage: Image = await this.image.save(newImage);
        if (!savedImage) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return await this.image.findOne({where: {
            imageId: savedImage.imageId
        }, relations: [
            'meal'
        ]});
    }

    async deleteById(id: number): Promise<DeleteResult> {
        return await this.image.delete(id);
    }

    async findImageForMeal(mealId:number, imageId: number): Promise<Image> {
        const meal = await this.meal.findOne({
            where: {
                mealId: mealId
            }
        });
        
        return await this.image.findOne({
            where: {
                meal: meal,
                imageId: imageId
            }
        })
    }
}
