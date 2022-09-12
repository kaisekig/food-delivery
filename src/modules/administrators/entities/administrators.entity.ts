import { Column, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Index('uq_administrator_username', ['username'], {unique: true})
@Entity('administrator')
export class Administrator {
    @PrimaryGeneratedColumn({
        name: 'administrator_id',
        type: 'int',
        unsigned: true
    })
    administratorId: number;

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
        default: '1',
    })
    isActive: number;

    @Column({
        name: 'role',
        type: 'enum',
        enum: [
            'super', 
            'moderator'
        ],
        default: 'moderator',
    })
    role: 'super' | 'moderator';

    @Column({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
    })
    updatedAt: Date;
}