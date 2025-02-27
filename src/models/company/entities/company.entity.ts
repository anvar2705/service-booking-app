import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Employee } from 'models/employee/entities/employee.entity';
import { Service } from 'models/service/entities/service.entity';

@Entity()
export class Company {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'varchar' })
    name: string;

    @OneToMany(() => Employee, (employee) => employee.company)
    employees: Employee[];

    @OneToMany(() => Service, (service) => service.company)
    services: Service[];

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;
}
