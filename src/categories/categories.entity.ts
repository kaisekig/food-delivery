import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn({
        name: 'category_id',
        type: 'int',
        unsigned: true
    })
    categoryId: number;

    @Column({
        name: 'title',
        type: 'varchar',
        length: '64',
        nullable: false,
        unique: true
    })
    title: string;

    @Column({
        name: 'parent__category_id',
        type: 'int',
        nullable: true,
        unsigned: true
    })
    parentCategoryId: number | null;

    @ManyToOne(() => Category, (category) => category.categories)

    @JoinColumn([{name: 'parent__category_id', referencedColumnName: 'categoryId'}])
    parentCategory: Category

    @OneToMany(() => Category, (category) => category.parentCategory)
    categories: Category[]
    
}