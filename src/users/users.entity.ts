import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn({
        name: 'user_id',
        type: 'int',
        unsigned: true
    })
    userId: number;

    @Column({
        name: 'username',
        type: 'varchar',
        length: '32',
        unique: true,
        nullable: false
    })
    username: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: '128',
        nullable: false
    })
    password: string;

    @Column({
        name: 'is_active',
        type: 'tinyint',
        default: () => '1'
    })
    isActive: number;

    @Column({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP()'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
    })
    updatedAt: Date;
}