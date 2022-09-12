import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Meal } from "./meals.entity";

@Entity('price')
export class Price {
    @PrimaryGeneratedColumn({
        name: 'price_id',
        type: 'int',
        unsigned: true
    })
    priceId: number;

    @Column({
        name: 'amount',
        type: 'decimal', precision: 7, scale: 2,
        nullable: false
    })
    amount: number;

    @ManyToMany(() => Meal, (meal) => meal.prices)
    meals: Meal[];
}