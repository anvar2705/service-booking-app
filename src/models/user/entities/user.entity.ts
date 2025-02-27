import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Role } from 'models/role/entities/role.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false, unique: true })
    username: string;

    @Column({ type: 'varchar', nullable: true, unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: false, select: false })
    password: string;

    @ManyToMany(() => Role, (role) => role.users, { eager: true })
    @JoinTable({ name: 'user_role' })
    roles: Role[];

    @CreateDateColumn({ select: false })
    public created_at: Date;

    @UpdateDateColumn({ select: false })
    public updated_at: Date;
}
