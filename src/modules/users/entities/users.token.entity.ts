import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";

@Entity('user_token')
export class UserToken {
    @PrimaryGeneratedColumn({
        type: 'int',
        'name': 'id',
        unsigned: true
    })
    id: number;

    @Column({
        'type': 'timestamp',
        'name': 'created_at',
        default: () => 'CURRENT_TIMESTAMP()'
    })
    createdAt: string;

    @Column({
        type: 'text',
        name: 'token',
        nullable: false
    })
    token: string;

    @Column({
        'type': 'datetime',
        'name': 'expires_at',
        nullable: false
    })
    expiresAt: string;

    @Column({
        'type': 'tinyint',
        name: 'is_valid',
        default: 1
    })
    isValid: number;

    @ManyToOne(() => User, (user) => user.tokens, {nullable: false})
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'userId'
    })
    user: User
}