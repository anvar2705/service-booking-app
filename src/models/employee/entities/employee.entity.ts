import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Company } from 'models/company/entities/company.entity';
import { Service } from 'models/service/entities/service.entity';
import { User } from 'models/user/entities/user.entity';

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    surname: string;

    @Column({ type: 'varchar', nullable: true })
    patronymic: string;

    @Column({ type: 'varchar', nullable: true })
    photo_url: string;

    @ManyToMany(() => Service, (service) => service.employees)
    services: Service[];

    @OneToOne(() => User, { eager: true })
    @JoinColumn()
    user: User;

    @ManyToOne(() => Company, (company) => company.employees)
    company: Company;
}
