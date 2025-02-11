import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { User } from 'models/user/entities/user.entity';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false, unique: true })
    name: string;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];

    @CreateDateColumn({ select: false })
    public created_at: Date;

    @UpdateDateColumn({ select: false })
    public updated_at: Date;
}
