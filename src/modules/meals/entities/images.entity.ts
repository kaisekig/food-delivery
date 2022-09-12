import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Meal } from "./meals.entity";

@Entity('image') 
export class Image {
    @PrimaryGeneratedColumn({
        name: 'image_id',
        type: 'int',
        unsigned: true
    })
    imageId: number;

    @Column({
        name: 'path',
        type: 'varchar',
        length: '255',
        nullable: false
        
    })
    path: string;

    @ManyToOne(()=> Meal, (meal) => meal.images, {nullable: false})
    @JoinColumn({
        name: 'meal_id',
        referencedColumnName: 'mealId'
    })
    meal: Meal;
}