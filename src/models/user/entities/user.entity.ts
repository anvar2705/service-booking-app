import { RolesEnum } from 'models/iam/constants';
import { Role } from 'models/iam/types';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false, unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: false, select: false })
    password: string;

    @Column({ enum: RolesEnum, default: RolesEnum.USER })
    role: Role;

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;
}
