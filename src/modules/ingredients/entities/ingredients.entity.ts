import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Meal } from "../../meals/entities/meals.entity";

@Entity('ingredient')
export class Ingredient {
    @PrimaryGeneratedColumn({
        name: 'ingredient_id',
        type: 'int',
        unsigned: true
    })
    ingredientId: number;

    @Column({
        name: 'name',
        type: 'varchar',
        length: '128',
        nullable: false,
        unique: true
    })
    name: string;

    @Column({
        name: 'spicy',
        type: 'tinyint',
        unsigned: true
    })
    spicy: number;

    @Column({
        name: 'alergen',
        type: 'tinyint',
    })
    alergen: number;

    @ManyToMany(() => Meal, (meal) => meal.ingredients)
    meals: Meal[];
}