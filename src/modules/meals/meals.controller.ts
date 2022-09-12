import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMealDto } from './dtos/create.meal.dto';
import { EditMealDto } from './dtos/edit.meal.dto';
import { UpdateMealPriceDto } from './dtos/update.meal.price.dto';
import { Meal } from './entities/meals.entity';
import { MealsService } from './meals.service';
import { diskStorage } from 'multer';
import { FileUpload } from 'src/helpers/file.upload';
import { ImagesService } from '../images/images.service';
import { Image } from './entities/images.entity';
import * as fs from 'fs';
import filetype from 'magic-bytes.js';
import { Response } from 'express';
import { RoleCheckerGuard } from 'src/commons/role.checker.guard';
import { AllowToRoles } from 'src/commons/allow.to.roles.desc';
import { CONFIGURATION } from 'configuration';

@Controller('meals')
export class MealsController {
    constructor(
        private readonly meal: MealsService,

        private readonly image: ImagesService
    ) {}

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin', 'user')
    @Get()
    async getAll(): Promise<Meal[] | HttpException> {
        try {
            return await this.meal.getAll();
        } catch {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin', 'user')
    @Get(':id')
    async getById(@Param('id') id: number): Promise<Meal | HttpException> {
        return new Promise(async (resolve, reject) => {
            const meal = await this.meal.getById(id);
            if (!meal) {
                return reject(new HttpException('Meal haven\'t been found', HttpStatus.NOT_FOUND));
            }

            return resolve(meal);
        });
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @Put('create')
    async create(@Body() data: CreateMealDto): Promise<Meal|HttpException>  {
        const meal = await this.meal.create(data);
        if (!meal) {
            throw new HttpException('Meal haven\'t been found', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new Promise(resolve => resolve(meal));
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @Patch(':id/update')
    async update(@Param('id') id:number, @Body() data: UpdateMealPriceDto): Promise<Meal | HttpException> {
        const meal =  await this.meal.update(id, data);
        if (!meal) {
            throw new HttpException('Meal haven\'t been found', HttpStatus.NOT_FOUND);
        }

        return new Promise(resolve => resolve(meal));
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @Patch(':id/edit')
    async edit(@Param('id') id: number, @Body() data: EditMealDto): Promise<Meal | HttpException> {
        const meal = await this.meal.edit(id, data);
        if (!meal) {
            throw new HttpException('Meal haven\'t been found', HttpStatus.NOT_FOUND);
        }

        return new Promise(resolve => resolve(meal));
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @Post(':id/upload-image')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: CONFIGURATION.storage.images.path,
            
            filename: (req, file, callback) => {
                FileUpload.filename(req, file, callback);
            }
        }),
        fileFilter: (req, file, callback) => {
            FileUpload.fileFilter(req, file, callback);
        },
        limits: {
            files: 1,
            fieldSize: CONFIGURATION.storage.images.maxSize,
        }
    }))
    async uploadImage(@Param('id') id:number, @UploadedFile() file, @Req() req): Promise<Image | HttpException> {
        if (req.fileFilterError) {
            throw new HttpException(req.fileFilterError, HttpStatus.EXPECTATION_FAILED);
        }

        if (!file) {
            throw new HttpException('Image isn\'t uploaded', HttpStatus.EXPECTATION_FAILED);
        }

        const type = filetype(fs.readFileSync(file.path));
        
        if (!type[0].typename) {
            fs.unlinkSync(file.path);
            return new HttpException('Can\'t detect file mimetype', HttpStatus.EXPECTATION_FAILED);
        }

        if (!(type[0].mime.includes('jpeg') || type[0].mime.includes('png'))) {
            fs.unlinkSync(file.path);
            throw new HttpException('Bad file content type', HttpStatus.EXPECTATION_FAILED);
        }
        
        return new Promise(async(resolve) => {
            resolve(await this.image.create(id, file.filename));
        });
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('admin')
    @Delete(':id/delete-image/:imageId')
    async deleteImage(@Param('id') id: number, @Param('imageId') imageId: number, @Res() res: Response): Promise<HttpException> {
        const image = await this.image.findImageForMeal(id, imageId);
        if (!image) {
            throw new HttpException('Image haven\'t been found', HttpStatus.NOT_FOUND);
        }

        fs.unlinkSync(CONFIGURATION.storage.images.path + image.path);

        const deleteResult =  await this.image.deleteById(image.imageId);
        if (deleteResult.affected === 0) {
            throw new HttpException('Image haven\'t been found', HttpStatus.NOT_FOUND);
        }

        return new HttpException('Image deleted successfuly', HttpStatus.OK);
    }
}