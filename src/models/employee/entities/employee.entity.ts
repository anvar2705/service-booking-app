import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Service } from 'models/service/entities/service.entity';
import { User } from 'models/user/entities/user.entity';

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    surname: string;

    @Column({ type: 'varchar', nullable: true })
    patronymic: string;

    @Column({ type: 'varchar', nullable: true })
    photo_url: string;

    @ManyToMany(() => Service, (service) => service.employees)
    services: Service[];

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
